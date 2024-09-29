import { Text, Pressable } from 'react-native';

export type ButtonProps = {

    title: string,
    classButton: string,
    classText: string,
    onPress: () => void,
}

export function Button({ title, classButton, classText, onPress, }: ButtonProps) {
    return (
        <Pressable className={`${classButton}`} onPress={onPress}>
            <Text className={`${classText}`}>
                {title}
            </Text>
        </Pressable>
    );
}