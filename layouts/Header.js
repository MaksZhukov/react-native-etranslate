import { inject, observer } from "mobx-react";
import { Button, Text, Header as NativeBaseHeader } from "native-base";
import React from "react";

const Header = ({ navigation, user }) => {
    return (
        <NativeBaseHeader>
            <Button>
                <Text>Dictionary</Text>
            </Button>
            <Button>
                <Text>Welcome</Text>
            </Button>
            <Button>
                <Text>Translator</Text>
            </Button>
            <Button
                onPress={async () => {
                    await user.logOut();
                    navigation.navigate("SignIn");
                }}>
                <Text>LogOut</Text>
            </Button>
        </NativeBaseHeader>
    );
};

export default inject("user")(observer(Header));
