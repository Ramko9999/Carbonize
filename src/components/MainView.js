/* global chrome */
import { Button, Header } from "semantic-ui-react";
import SettingsView from "./settings/SettingsView";
import { useState, useEffect} from "react";
import isInDevelopmentMode from "../util/Mode";

const SETTING = "setting";
const USAGE = "usage";

const MainView = () => {

    const [tab, setTab] = useState(SETTING);

    const getContent = () => {
        if(tab === SETTING){
            return (<SettingsView/>);
        }
        else{
            return (<div>Promo View</div>);
        }
    }

    return (
        <div style={{ alignContent: "center", textAlign: "center" }}>
            <div style={{ marginTop: "5%" }}>
                <Header size="large">
                    Carbonize
                </Header>
                <div style={{minHeight: 500}}>
                    {getContent()}
                </div>
                <div style={{width: "100%"}}>
                    <Button.Group size="huge">
                        <Button icon="setting" onClick={() => { setTab(SETTING) }} />
                        <Button icon={tab === "usage" ? "address card" : "address card outline"} onClick={() => { setTab(USAGE) }} />
                    </Button.Group>
                </div>
            </div>
        </div>
    )
}

export default MainView;