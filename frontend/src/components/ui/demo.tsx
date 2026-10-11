import TextLoop from "@/components/ui/text-loop";

export default function TextLoopDemo() {
  return (
    <div className="flex min-h-[350px] w-full items-center justify-center p-8">
      <TextLoop
        staticText="Design"
        rotatingTexts={["Limitless", "Timeless", "Flawless"]}
      />
    </div>
  );
}
