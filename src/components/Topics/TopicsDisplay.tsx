import { createSignal, useContext } from "solid-js";
import CreateTopicForm from "./CreateTopicForm";
import TopicsList from "./TopicsList";
import { GlobalContext, RelayContainer } from "~/contexts/GlobalContext";
import { Event, getEventHash } from "nostr-tools";

export const getUTCSecondsSinceEpoch = (): number => {
  const now = new Date();
  const utcMilllisecondsSinceEpoch =
    now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  return Math.round(utcMilllisecondsSinceEpoch / 1000);
};

export const emitEventToConnectedRelays = ({
  event,
  connectedRelayContainers,
}: {
  event: Event;
  connectedRelayContainers: RelayContainer[];
}) => {
  connectedRelayContainers.forEach((relayContainer) => {
    if (relayContainer.relay) {
      relayContainer.relay.publish(event);
    }
  });
};

const TopicsDisplay = () => {
  const globalContext = useContext(GlobalContext);
  const [showCreateTopicForm, setShowCreateTopicForm] = createSignal(false);

  const onCancel = () => {
    setShowCreateTopicForm(false);
  };
  const onCreateTopic = (topic: string) => {
    const eventPublicKey =
      globalContext &&
      globalContext.connectedUser &&
      globalContext.connectedUser()?.publicKey;
    if (!eventPublicKey) return;
    const createdAt = getUTCSecondsSinceEpoch();
    const event: Event = {
      id: "",
      sig: "",
      kind: 1,
      pubkey: eventPublicKey,
      tags: [["arguflow"], ["arguflow-topic-question"]],
      created_at: createdAt,
      content: JSON.stringify({
        topicQuestion: topic,
      }),
    };
    event.id = getEventHash(event);
    (window as any).nostr.signEvent(event).then((signedEvent: Event) => {
      if (globalContext && globalContext.relays) {
        const connectedRelayContainers = globalContext
          .relays()
          .filter((relay) => relay.connected);
        emitEventToConnectedRelays({
          event: signedEvent,
          connectedRelayContainers: connectedRelayContainers,
        });
      }
      setShowCreateTopicForm(false);
    });
  };

  return (
    <div class="flex w-full max-w-[75%] flex-col items-center justify-center space-y-6 rounded-lg border border-slate-600 py-2">
      <div class="flex w-full items-center justify-center space-x-3 border-b border-slate-700 py-2">
        <div class="w-fit text-2xl font-bold text-white">Your Topics</div>
        {!showCreateTopicForm() && (
          <button
            class="w-fit rounded-full border border-green-500 bg-transparent px-2 text-green-500"
            onClick={() => {
              setShowCreateTopicForm(true);
            }}
          >
            +
          </button>
        )}
      </div>
      {showCreateTopicForm() && (
        <div class="w-full px-4">
          <CreateTopicForm onCreateTopic={onCreateTopic} onCancel={onCancel} />
        </div>
      )}
      <TopicsList />
    </div>
  );
};

export default TopicsDisplay;