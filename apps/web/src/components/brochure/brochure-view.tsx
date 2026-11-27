import { BrochurePanel } from "@/components/brochure/brochure-panel";
import { BrochureStatesPreview } from "@/components/brochure/brochure-states";
import { BrochureUrlBar } from "@/components/brochure/brochure-url-bar";
import { CallLog } from "@/components/brochure/call-log";
import { SourcePanel } from "@/components/brochure/source-panel";
import { StepStepper } from "@/components/brochure/step-stepper";
import { brochureDemo, models } from "@/mocks/data";

export function BrochureView() {
  const modelName =
    models.find((model) => model.id === brochureDemo.modelId)?.name ??
    brochureDemo.modelId;

  return (
    <div className="flex flex-col gap-6">
      <BrochureUrlBar
        models={models}
        defaultUrl={brochureDemo.url}
        defaultTone={brochureDemo.tone}
        defaultModelId={brochureDemo.modelId}
      />

      <StepStepper steps={brochureDemo.steps} />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start">
        <SourcePanel demo={brochureDemo} />
        <BrochurePanel
          blocks={brochureDemo.blocks}
          tone={brochureDemo.tone}
          modelName={modelName}
        />
      </div>

      <CallLog entries={brochureDemo.callLog} models={models} />

      <BrochureStatesPreview />
    </div>
  );
}
