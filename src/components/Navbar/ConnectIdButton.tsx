import { useContext } from "solid-js";
import { GlobalContext } from "~/contexts/GlobalContext";

export const getNostrPublicKey = async () => {
  if (typeof window !== "undefined" && (window as any).nostr) {
    const nostr = (window as any).nostr;
    const nostrPublicKey = await nostr.getPublicKey();
    return nostrPublicKey;
  }
};

const ConnectIdButton = () => {
  const globalStore = useContext(GlobalContext);

  return (
    <div class="h-fit w-fit rounded-full border border-yellow-500">
      <button
        class="px-4 py-2 text-yellow-500"
        onClick={() =>
          getNostrPublicKey().then((nostrPublicKey) => {
            globalStore.setConnectedUser({
              publicKey: nostrPublicKey,
            });
          })
        }
      >
        Connect ID
      </button>
    </div>
  );
};

export default ConnectIdButton;