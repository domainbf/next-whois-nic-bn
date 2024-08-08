// ... existing code ...
const ResultComp = React.forwardRef<HTMLDivElement, Props>(
  ({ data, target, isCapture }: Props, ref) => {
    const copy = useClipboard(); // 确保在这里定义 copy
    const captureObject = React.useRef<HTMLDivElement>(null);
    const capture = useImageCapture(captureObject);
    const { status, result, error, time } = data;

    return (
      <div
        className={cn(
          "w-full h-fit mt-4",
          isCapture && "flex flex-col items-center m-0 p-4 w-full bg-background"
        )}
      >
        <Card
          ref={ref}
          className={cn("shadow", isCapture && "w-fit max-w-[768px]")}
        >
          <CardHeader>
            <CardTitle className="flex flex-row items-center text-lg md:text-xl">
              详情如下:
              {/* ... existing code ... */}
            </CardTitle>
            <CardContent className="w-full p-0">
              {!status ? (
                <ErrorArea error={error} />
              ) : (
                <div className="flex flex-col h-fit w-full mt-2">
                  <ResultTable result={result} target={target} copy={copy} /> {/* 传递 copy */}
                  {/* ... existing code ... */}
                </div>
              )}
            </CardContent>
          </CardHeader>
        </Card>
      </div>
    );
  }
);

// 更新 ResultTable 以接收 copy 函数
function ResultTable({ result, target, copy }: ResultTableProps & { copy: (text: string) => void; }) {
  // ... existing code ...
  <Row
    name="域名DNS:"
    value={
      <div className="flex flex-col">
        {result.nameServers.map((ns, index) => (
          <div
            key={index}
            className="text-secondary hover:text-primary transition duration-500 text-xs border cursor-pointer rounded-md px-1 py-0.5 mt-0.5 w-fit inline-flex flex-row items-center"
            onClick={() => copy(ns)} // 使用传递的 copy 函数
          >
            <CopyIcon className="w-2.5 h-2.5 mr-1" />
            {ns}
          </div>
        ))}
      </div>
    }
    hidden={result.nameServers.length === 0}
  />
  // ... existing code ...
}
