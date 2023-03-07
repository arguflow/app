import { VsReply } from "solid-icons/vs";
import { CgProfile } from "solid-icons/cg";
import { For } from "solid-js";
import { Rebuttal } from "./types";
import { ScrollRelevantElementsIntoViewButton } from "../layouts/ScrollRelevantElementsIntoView";

export interface RebuttalViewProps {
  rebuttal: Rebuttal;
  onCounterArgumentClick: () => void;
  highlighted?: boolean;
}

export const RebuttalView = (props: RebuttalViewProps) => {
  return (
    <div
      classList={{
        "rounded-md border-2 p-2 text-white w-full flex flex-col space-y-2":
          true,
        "border-orange-500": !!props.rebuttal.rebuttalContent.counterWarrants,
        "border-fuchsia-500": !props.rebuttal.rebuttalContent.counterWarrants,
        "bg-neutral-900": props.highlighted,
      }}
    >
      <div class="flex w-full flex-row items-center justify-between space-x-2">
        <div class="flex flex-col space-y-2 ">
          <div class="grid grid-cols-[18px_1fr] gap-y-2">
            {!!props.rebuttal.rebuttalContent.counterWarrants && (
              <>
                <div class="font-bold text-orange-500">W</div>
                <div class="flex w-full flex-row items-center justify-between space-x-2 text-orange-500">
                  <For each={props.rebuttal.rebuttalContent.counterWarrants}>
                    {(warrant) => {
                      return (
                        <a
                          href={warrant.link}
                          target="_blank"
                          rel="noreferrer"
                          class="underline"
                        >
                          {warrant.name}
                        </a>
                      );
                    }}
                  </For>
                </div>
              </>
            )}

            <div class="font-bold">D</div>
            <div class="flex w-full flex-row items-center justify-between space-x-2">
              <span>{props.rebuttal.rebuttalContent.description}</span>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => props.onCounterArgumentClick()}
          aria-label="Create Warrant Rebuttal"
          classList={{
            "p-1 border rounded-full h-fit self-center": true,
          }}
        >
          <VsReply />
        </button>
      </div>
      <div class="flex items-center justify-between">
        <ScrollRelevantElementsIntoViewButton
          statementId={props.rebuttal.originalStatementEventId}
          typesToScrollIntoView={["statement", "counterargument", "summary"]}
        />
        <div class="flex items-center space-x-1">
          <CgProfile />
          <p>
            {props.rebuttal.event.pubkey.slice(0, 3)}...
            {props.rebuttal.event.pubkey.slice(-3)}
          </p>
        </div>
      </div>
    </div>
  );
};
