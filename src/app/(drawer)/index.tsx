import { View, TouchableOpacity, Text, ImageBackground, Image } from "react-native";
import { router } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
    return (
        <View className="flex-1 flex-col bg-stone-100 dark:bg-slate-800">
            <View className="h-1/3">
                <ImageBackground
                    source={require("@/assets/background.jpg")}
                    className="h-full justify-center items-center"
                    resizeMode="cover">
                    <Image source={require("@/assets/icon.png")} style={{ width: 100, height: 100 }} />
                    <View>
                        <Text className="text-4xl text-slate-800 font-bold text-center font-serif">
                            Bíblia Sagrada
                        </Text>
                        <Text className="text-2xl text-slate-800 font-bold text-center font-serif">
                            sem anúncios
                        </Text>
                    </View>

                </ImageBackground>
            </View>

            <View className="flex flex-1 flex-col gap-px">
                <View className="flex flex-row justify-between gap-px">
                    <TouchableOpacity
                        className="bg-blue-600 flex-1 justify-center items-center h-full"
                        onPress={() => router.push({ pathname: "/books/" })}>
                        <Ionicons name="book" size={32} color="white" />
                        <Text className="text-white text-xl mt-2">Bíblia</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="bg-blue-600 flex-1 justify-center items-center h-full"
                        onPress={() => router.push({ pathname: "/search/" })}>
                        <Ionicons name="search" size={32} color="white" />
                        <Text className="text-white text-xl mt-2">Buscar</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    className="bg-blue-600 flex-1 justify-center items-center h-full"
                    onPress={() => router.push({ pathname: "/settings/" })}>
                    <Ionicons name="settings" size={32} color="white" />
                    <Text className="text-white text-xl mt-2">Configurações</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}