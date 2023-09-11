import styled from "styled-components";
import Vacation from "./Vacation";

const Div = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;

    > div {
        flex-grow: 1;
    }

    div.choice {
        display: flex;
        justify-content: flex-end;
    }

    button {
        margin-left: 15px;
        margin-right: 15px;
    }
`;
export default function VacationCard({vacation}) {
    return (
        <Div>
            <Vacation vacation={vacation} />
            <div className="choice">
                <button>accept</button>
                <button>reject</button>
            </div>
        </Div>
    );
}