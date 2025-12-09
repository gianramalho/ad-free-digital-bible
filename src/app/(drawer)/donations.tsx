import { useIAP } from 'expo-iap';
import { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function DonationScreen() {
  const {
    connected,
    products,
    fetchProducts,
    requestPurchase,
    finishTransaction,
  } = useIAP({
    onPurchaseSuccess: async (purchase) => {
      console.log('Purchase successful:', purchase);
      await finishTransaction({ purchase, isConsumable: true });
    },
    onPurchaseError: (error) => {
      console.error('Purchase failed:', error);
    },
  });

  const productIds = ['apoio_2_reais', 'apoio_5_reais', 'apoio_10_reais', 'decolagem_total'];

  console.log(products)

  useEffect(() => {
    if (connected) {
      fetchProducts({ skus: productIds, type: 'in-app' });
    }
  }, [connected]);

  const handlePurchase = async (productId: string) => {
    try {
      await requestPurchase({
        type: 'in-app',
        request: {
          android: {
            skus: [productId],
          },
        },
      });
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };
  return (
    <View className="flex-1 px-1 flex-col justify-center items-center bg-stone-100 dark:bg-slate-800">
      <View className="flex-1 px-6">
        <View className="w-full mb-8">
          <Text className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-2">
            Apoie o Desenvolvimento
          </Text>
        </View>

        <View className="w-full gap-4">
          {products.map((product) => {
            const maxPrice = Math.max(...products.map(p => p.price ?? 0));
            const isHighlight = product.price === maxPrice;

            return (
              <View key={product.id} className="relative w-full">

                {isHighlight && (
                  <View className="absolute -top-3 right-0 z-10 bg-white px-3 py-1 rounded-lg shadow-sm border border-slate-100">
                    <Text className="text-blue-600 font-bold text-xs uppercase">
                      Recomendado
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handlePurchase(product.id)}
                  className={`
                  flex-row items-center p-4 rounded-2xl w-full shadow-lg 
                  ${isHighlight
                      ? 'bg-blue-600 dark:bg-blue-800 dark:border dark:border-blue-800'
                      : 'bg-stone-50 dark:bg-slate-800 dark:border dark:border-slate-700'}
                `}
                >
                  <View className="flex-1">
                    <Text className={`
                    text-lg font-bold text-center
                    ${isHighlight ? 'text-white' : 'text-slate-800 dark:text-white'}
                  `}>
                      {product.displayName} - {product.displayPrice}
                    </Text>
                  </View>

                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};
