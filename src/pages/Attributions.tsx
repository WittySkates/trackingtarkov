import "./styles/attributions.scss";

const Attributions = () => {
    return (
        <div className="credits">
            <h2>Quest Information</h2>
            <p>
                A huge thank you to the Official Escape from Tarkov Wiki,
                without their hard work this website would not be possible. If
                you want to check them out they can be found{" "}
                <a
                    href="https://escapefromtarkov.fandom.com/wiki/Escape_from_Tarkov_Wiki"
                    target="_blank"
                    rel="noreferrer"
                >
                    here
                </a>
                . All quest information is sourced directly from the Official
                Escape from Tarkov Wiki and is licensed under the Creative
                Commons Attribution-Share Alike License.
            </p>
            <h2>Graph Visualization</h2>
            <p>
                We are using{" "}
                <a
                    href="https://reactflow.dev/"
                    target="_blank"
                    rel="noreferrer"
                >
                    react flow
                </a>{" "}
                along with{" "}
                <a
                    href="https://github.com/dagrejs/dagre"
                    target="_blank"
                    rel="noreferrer"
                >
                    dagrejs
                </a>{" "}
                to generate the graph for the quests.
            </p>
        </div>
    );
};

export default Attributions;
