/* global chrome */
import { Container, Dropdown, Grid, List } from "semantic-ui-react";
import isInDevelopmentMode from "../../util/Mode";
import {useState, useEffect} from "react";

const settings = {
    theme: {
        name: "Theme",
        options: ["cobalt", "dracula", "blackboard", "lucario", "monokai"],
        onSelect: (selection, callback) => {
            if (isInDevelopmentMode) {
                callback();
            }
            else {
                chrome.storage.sync.set({ theme: selection }, () => {
                    callback();
                })
            }
        }
    },
    language: {
        name: "Language",
        options: ['c', 'python', 'java', 'javascript', 'typescript', 'text', 'auto'],
        onSelect: (selection, callback) => {
            if (isInDevelopmentMode) {
                callback();
            }
            else {
                chrome.storage.sync.set({ language: selection }, () => {
                    callback();
                });
            }
        }
    },
    font: {
        name: "Font",
        options: ["Hack"],
        onSelect: (selection, callback) => {
            if (isInDevelopmentMode) {
                callback();
            }
            else {
                chrome.storage.sync.set({ font: selection }, () => {
                    callback();
                });
            }
        }
    }
}

const fields = ["theme", "font", "language"];

const SettingsView = () => {

    const [prefs, setPrefs] = useState({});
    
    useEffect(()=>{
        if(isInDevelopmentMode){
            setPrefs({
                theme: "blackboard",
                language: "auto",
                font: "Hack"
            });
        }
        else{
            chrome.storage.sync.get(fields, (data)=> {
                setPrefs(data);
            });
        }
    }, [])

    const getSelectionOptions = (options) => {
        return options.map((option) => {
            return {
                key: option,
                text: option,
                value: option,
            };
        });
    }

    const isLoading = () => Object.keys(prefs).length === 0;

    
    if(isLoading()){
        return (<div>
            Loading Settings...
        </div>);
    }

    return (<div>
        <List>
            {Object.keys(settings).map((key) => {
                const { options, name, onSelect } = settings[key];
                return (<List.Item key={name}>
                    <List.Content>
                        <Grid>
                            <Grid.Column width={4}>
                                <div style={{ verticalAlign: "center" }}>
                                    <Container>
                                        {name}
                                    </Container>
                                </div>
                            </Grid.Column>
                            <Grid.Column width={9}>
                                <Dropdown selection
                                    fluid
                                    placeholder={`Select ${name}`}
                                    onChange={(event, { value }) => {
                                        onSelect(value, () => {
                                            let updated = JSON.parse(JSON.stringify(prefs));
                                            updated[key] = value;
                                            setPrefs(updated);
                                            console.log(`Updated! ${value}`);
                                        })
                                    }}
                                    options={getSelectionOptions(options)} 
                                    value={prefs[key]}
                                    >
                                </Dropdown>
                            </Grid.Column>
                        </Grid>
                    </List.Content>
                </List.Item>);
            })}
        </List>
    </div>);
};

export default SettingsView;