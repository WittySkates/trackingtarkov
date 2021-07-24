/** @module scraper */
import firebase from "firebase";
import _ from "lodash";
import axios from "axios";
import cheerio from "cheerio";
import config from "../config.js";

firebase.initializeApp(config);
const database = firebase.database();

const getPriorNext = async (res, trader, title, link) => {
  try {
    const { data } = await axios.get(link);
    const $ = cheerio.load(data);
    const prior = [];
    const next = [];
    $(".va-infobox-content").each((_idx, el) => {
      if (
        $(el)
          .text()
          .match(/(Previous:)(.*)/gs)
      ) {
        const lisPr = $(el).children();
        $(lisPr).each((_idx, el) => {
          if ($(el).is("a")) {
            prior.push($(el).text());
          }
        });
        _.set(res, `${trader}.Quests.${title}.Prior`, prior);
      }
      if (
        $(el)
          .text()
          .match(/(Leads to:)(.*)/gs)
      ) {
        const li = $(el).children();
        $(li).each((_idx, el) => {
          if ($(el).is("a")) {
            next.push($(el).text());
          }
        });
        _.set(res, `${trader}.Quests.${title}.Next`, next);
      }
    });
    return;
  } catch (error) {
    throw error;
  }
};

const getUrls = async () => {
  try {
    const { data } = await axios.get(
      "https://escapefromtarkov.fandom.com/wiki/Quests"
    );
    const $ = cheerio.load(data);
    const res = {};
    let promises = [];
    $(".dealer-toggle").each((_idx, el) => {
      let image = $(el).children().attr("data-src");
      image = image.replace(/(.*.png)(.*)/, (match, link) => {
        return link;
      });
      const title = $(el).attr("title");
      _.set(res, title, { image });
    });

    Object.keys(res).forEach(trader => {
      const path = `.${trader}-content > tbody > tr`;
      let title = "";
      $(path).each((_idx, el) => {
        if (_idx === 0 || _idx === 1) {
          return;
        }
        const tds = $(el).children();
        $(tds).each((_idx, el) => {
          const text = $(el).text().replace(/\n+/g, "");
          switch (_idx) {
            case 0:
              title = text;
              const link =
                "https://escapefromtarkov.fandom.com/" +
                $(el).children().attr("href");
              _.set(res, `${trader}.Quests.${title}`, {});
              _.set(res, `${trader}.Quests.${title}.Name`, title);
              _.set(res, `${trader}.Quests.${title}.Link`, link);

              const prom = getPriorNext(res, trader, title, link);
              promises.push(prom);

              break;
            case 1:
              _.set(res, `${trader}.Quests.${title}.Type`, text);
              break;
            case 2:
              const objectives = [];
              const lisOb = $(el).children().children();
              $(lisOb).each((_idx, el) => {
                objectives.push($(el).text().replace(/\n+/g, ""));
              });
              _.set(res, `${trader}.Quests.${title}.Objectives`, objectives);
              break;
            case 3:
              const rewards = [];
              const lisRe = $(el).children().children();
              $(lisRe).each((_idx, el) => {
                rewards.push($(el).text().replace(/\n+/g, ""));
              });
              _.set(res, `${trader}.Quests.${title}.Rewards`, rewards);
              // _.set(res, `${trader}.Quests.${title}.isCompleted`, false);
              break;
            default:
              break;
          }
        });
      });
    });
    await Promise.all(promises);
    return res;
  } catch (error) {
    throw error;
  }
};

const findRoots = quests => {
  const roots = [];
  for (const [name, quest] of Object.entries(quests)) {
    if (quest.Prior === undefined || quest.Prior.length === 0) {
      roots.push(name);
    } else {
      let hasPrior = false;

      quest.Prior.forEach(prior => {
        if (typeof quests[prior] != "undefined") {
          hasPrior = true;
        }
      });
      if (!hasPrior) {
        roots.push(name);
      }
    }
  }
  return roots;
};

// () -> () -> () -> () -> ***
const getTree = (tree, roots, quests) => {
  _.forEach(roots, questName => {
    if (!quests[questName]?.Next) {
      return;
    }
    const entry = {
      name: questName,
      attributes: {
        Objectives: quests[questName].Objectives,
        Rewards: quests[questName].Rewards,
        type: quests[questName].Type,
      },
      children: [],
    };
    getTree(entry.children, quests[questName].Next, quests);
    tree.push(entry);
  });
};

const removeDuplicatesHelper = (tree, visisted) => {};

const removeDuplicates = tree => {
  const visited = [];
  removeDuplicatesHelper(tree, visited);
};

const generateTraderTree = traderQuests => {
  const allTraderTrees = [];
  const traders = Object.keys(traderQuests);
  traders.forEach(trader => {
    const roots = findRoots(traderQuests[trader].Quests);
    const tree = [];
    getTree(tree, roots, traderQuests[trader].Quests);
    allTraderTrees.push({ name: trader, children: tree });
    // _.set(allTraderTrees, trader, tree);
  });
  return allTraderTrees;
};

const push = async () => {
  const traderQuests = await getUrls();
  const traderTree = generateTraderTree(traderQuests);
  const traderTreeString = JSON.stringify(traderTree);
  var timeout = 8000;
  database.ref().child("traderQuests").set(traderQuests);
  database.ref().child("traderTree").set(traderTreeString);

  setTimeout(() => {
    firebase.app().delete();
  }, timeout);
};
push();
