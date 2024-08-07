const ResultComp = React.forwardRef<HTMLDivElement, Props>(
  ({ data, target, isCapture }: Props, ref) => {
    const copy = useClipboard();
    const captureObject = React.useRef<HTMLDivElement>(null);
    const capture = useImageCapture(captureObject);

    const { status, result, error, time, price } = data;

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
            <div className="mb-2">
              <h2 className="text-lg font-semibold">域名信息概览</h2>
              <p className="text-sm text-gray-600">以下是关于域名的详细信息：</p>
            </div>
            <CardTitle className={`flex flex-row items-center text-lg md:text-xl`}>
              详情如下:
              {/* 其他代码保持不变 */}
            </CardTitle>
            <CardContent className={`w-full p-0`}>
              {!status ? (
                <ErrorArea error={error} />
              ) : (
                <div className={`flex flex-col h-fit w-full mt-2`}>
                  <ResultTable result={result} target={target} />
                  
                  {/* 显示价格信息 */}
                  <div className="mt-2">
                    <h3 className="text-md font-semibold">价格信息</h3>
                    <p>注册价格: {price.new} {price.currency}</p>
                    <p>续费价格: {price.renew} {price.currency}</p>
                    <p>转入价格: {price.transfer} {price.currency}</p>
                  </div>

                  {!isCapture && (
                    <RichTextarea
                      className={`mt-2`}
                      name={`原始whois数据可复制及下载👉`}
                      value={result?.rawWhoisContent}
                      saveFileName={`${target.replace(/\./g, "-")}-whois.txt`}
                    />
                  )}
                </div>
              )}
            </CardContent>
          </CardHeader>
        </Card>
      </div>
    );
  }
);
