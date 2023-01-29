import { createSignal, useContext } from "solid-js";
import { Event } from "nostr-tools";
import { GlobalContext, RelayContainer, User } from "~/contexts/GlobalContext";
import { NostrUserMetadata } from "~/nostr-types";

export interface UserPreviewProps {
  user: User | null;
}

export const UserPreview = (props: UserPreviewProps) => {
  if (!props.user) return null;

  return (
    <div class="flex items-center space-x-1">
      <div class="flex flex-col justify-between">
        <div class="font-semibold">{props.user.name}</div>
        <div class="font-light">{`${props.user.publicKey.slice(
          0,
          3,
        )}...${props.user.publicKey.slice(-3)}`}</div>
      </div>
      <img
        alt="profile-picture"
        class="h-12 w-12 rounded-full"
        src={props.user.avatar}
      />
    </div>
  );
};

export const getNostrUserMetadata = async ({
  publicKey,
  connectedRelayContainers,
  onMetadataReceived,
}: {
  publicKey: string;
  connectedRelayContainers: RelayContainer[];
  onMetadataReceived: (metadata: Event) => void;
}) => {
  connectedRelayContainers.forEach((relayContainer) => {
    if (relayContainer.relay) {
      const relay = relayContainer.relay;
      const metadataSub = relay.sub(
        [
          {
            authors: [publicKey],
            kinds: [0],
          },
        ],
        {
          skipVerification: true,
        },
      );

      metadataSub.on("event", (event: Event) => {
        onMetadataReceived(event);
      });
    }
  });
};

const NostrUserPreview = () => {
  const globalStore = useContext(GlobalContext);
  const [metadata, setMetadata] = createSignal<Event | null>(null);

  if (
    !globalStore.connectedUser ||
    !globalStore.connectedUser() ||
    !globalStore.connectedUser()?.publicKey
  )
    return null;

  if (
    globalStore.relays &&
    globalStore.relays().find((relay) => relay.connected)
  ) {
    const connectedRelayContainers = globalStore
      .relays()
      .filter((relay) => relay.connected);
    const userPublicKey = globalStore.connectedUser()?.publicKey;

    if (userPublicKey) {
      getNostrUserMetadata({
        publicKey: userPublicKey,
        connectedRelayContainers: connectedRelayContainers,
        onMetadataReceived: (metadataEvent: Event) => {
          const nostrUserMetadata = JSON.parse(
            metadataEvent.content,
          ) as NostrUserMetadata;
          globalStore.connectedUser &&
            globalStore.connectedUser() &&
            globalStore.setConnectedUser({
              ...globalStore.connectedUser(),
              publicKey: userPublicKey,
              name: nostrUserMetadata.name,
              email: nostrUserMetadata.nip05,
              avatar: nostrUserMetadata.picture,
            });
        },
      });
    }
  }

  const nostrPublicKey =
    globalStore.connectedUser()?.publicKey.slice(0, 3) +
    "..." +
    globalStore.connectedUser()?.publicKey.slice(-3);

  return (
    <div class="text-white">
      {globalStore.connectedUser()?.name ? (
        <UserPreview user={globalStore.connectedUser()} />
      ) : (
        nostrPublicKey
      )}
    </div>
  );
};

export default NostrUserPreview;