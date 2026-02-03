import * as React from "react";
import { cn } from "@/lib/utils";

interface FlippableCreditCardProps extends React.HTMLAttributes<HTMLDivElement> {
  cardholderName?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  isFlipped?: boolean;
  frontMessage?: string;
  backMessage?: string;
  showBorder?: boolean;
}

const FlippableCreditCard = React.forwardRef<HTMLDivElement, FlippableCreditCardProps>(
  ({ className, cardholderName = "", cardNumber = "", expiryDate = "", cvv = "", isFlipped = false, frontMessage = "", backMessage = "", showBorder = false, ...props }, ref) => {
    return (


      <div
        className={cn("group h-40 w-64 [perspective:1000px]", className)}
        ref={ref}
        style={{
          cursor: showBorder ? 'pointer' : 'default',
        }}
        {...props}
      >
        <div 
          className="relative h-full w-full rounded-xl transition-transform duration-700 [transform-style:preserve-3d]"
          style={{
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            border: showBorder ? '2px solid #ffc700' : 'none',
            boxShadow: showBorder 
              ? '0 0 10px rgba(255, 199, 0, 0.8), 0 0 20px rgba(255, 199, 0, 0.4), 0 10px 30px rgba(0, 0, 0, 0.5), 0 5px 15px rgba(0, 0, 0, 0.3)' 
              : '0 10px 30px rgba(0, 0, 0, 0.5), 0 5px 15px rgba(0, 0, 0, 0.3)',
            transition: 'transform 0.7s, border 0.2s ease, box-shadow 0.2s ease',
          }}
        >
          <div className="absolute h-full w-full rounded-xl bg-card text-card-foreground [backface-visibility:hidden]">
            <div className="relative flex h-full flex-col justify-between p-4">
              <div className="flex items-start justify-between">
                <svg
                  className="h-9 w-9"
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  viewBox="0 0 50 50"
                >
                  <image href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAB6VBMVEUAAACNcTiVeUKVeUOYfEaafEeUeUSYfEWZfEayklayklaXe0SWekSZZjOYfEWYe0WXfUWXe0WcgEicfkiXe0SVekSXekSWekKYe0a9nF67m12ZfUWUeEaXfESVekOdgEmVeUWWekSniU+VeUKVeUOrjFKYfEWliE6WeESZe0GSe0WYfES7ml2Xe0WXeESUeEOWfEWcf0eWfESXe0SXfEWYekSVeUKXfEWxklawkVaZfEWWekOUekOWekSYfESZe0eXekWYfEWZe0WZe0eVeUSWeETAnmDCoWLJpmbxy4P1zoXwyoLIpWbjvXjivnjgu3bfu3beunWvkFWxkle/nmDivXiWekTnwXvkwHrCoWOuj1SXe0TEo2TDo2PlwHratnKZfEbQrWvPrWuafUfbt3PJp2agg0v0zYX0zYSfgkvKp2frxX7mwHrlv3rsxn/yzIPgvHfduXWXe0XuyIDzzISsjVO1lVm0lFitjVPzzIPqxX7duna0lVncuHTLqGjvyIHeuXXxyYGZfUayk1iyk1e2lln1zYTEomO2llrbt nOafkjFpGSbfkfZtXLhvHfkv3nqxH3mwXujhU3KqWizlFilh06khk2fgkqsjlPHpWXJp2erjVOhg0yWe0SliE+XekShhEvAn2D///+gx8TWAAAARnRSTlMACVCTtsRl7Pv7+vxkBab7pZv5+ZlL/UnU/f3SJCVe+Fx39naA9/75XSMh0/3SSkia+pil/KRj7Pr662JPkrbP7OLQ0JFOijI1MwAAAAFiS0dEorDd34wAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfnAg0IDx2lsiuJAAACLElEQVRIx2NgGAXkAUYmZhZWPICFmYkRVQcbOwenmzse4MbFzc6DpIGXj8PD04sA8PbhF+CFaxEU8iWkAQT8hEVgOkTF/InR4eUVICYO1SIhCRMLDAoKDvFDVhUaEhwUFAjjSUlDdMiEhcOEItzdI6OiYxA6YqODIt3dI2DcuDBZsBY5eVTr4xMSYcyk5BRUOXkFsBZFJTQnp6alQxgZmVloUkrKYC0qqmji2WE5EEZuWB6alKoKdi35YQUQRkFYPpFaCouKIYzi6EDitJSUlsGY5RWVRGjJLyxNy4ZxqtIqqvOxaVELQwZFZdkIJVU1RSiSalAt6rUwUBdWG1CP6pT6gNqwOrgCdQyHNYR5YQFhDXj8MiK1IAeyN6aORiyBjByVTc0FqBoKWpqwRCVSgilOaY2OaUPw29qjOzqLvTAchpos47u6EZyYnngUSRwpuTe6D+6qaFQdOPNLRzOM1dzhRZyW+CZouHk3dWLXglFcFIflQhj9YWjJGlZcaKAVSvjyPrRQ0oQVKDAQHlYFYUwIm4gqExGmBSkutaVQJeomwViTJqPK6OhCy2Q9sQBk8cY0DxjTJw0lAQWK6cOKfgNhpKK7ZMpUeF3jPa28BCETamiEqJKM+X1gxvWXpoUjVIVPnwErw71nmpgiqiQGBjNzbgs3j1nus+fMndc+Cwm0T52/oNR9lsdCS24ra7Tq1cbWjpXV3sHRCb1idXZ0sGdltXNxRateRwHRAACYHutzk/2I5QAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMy0wMi0xM1QwODoxNToyOSswMDowMEUnN7UAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjMtMDItMTNUMDg6MTU6MjkrMDA6MDA0eo8JAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDIzLTAyLTEzVDA4OjE1OjI5KzAwOjAwY2+u1gAAAABJRU5ErkJggg==" />
                </svg>
                <p className="font-bold tracking-widest text-sm">MASTERCARD</p>
              </div>

              {frontMessage && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl">
                  <p className="text-center font-bold text-xl tracking-wide px-4" style={{ color: '#ffc700' }}>
                    {frontMessage}
                  </p>
                </div>
              )}

              <div className="text-center font-mono text-lg tracking-wider">
                {cardNumber || <span className="opacity-40">•••• •••• •••• ••••</span>}
              </div>

              <div className="flex items-end justify-between">
                <div className="text-left">
                  <p className="text-xs font-semibold uppercase opacity-70">Card Holder</p>
                  <p className="font-mono text-sm font-medium">
                    {cardholderName || <span className="opacity-40">YOUR NAME</span>}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold uppercase opacity-70">Expires</p>
                  <p className="font-mono text-sm font-medium">
                    {expiryDate || <span className="opacity-40">MM/YY</span>}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute h-full w-full rounded-xl bg-card text-card-foreground [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="flex h-full flex-col relative">
              <div className="mt-6 h-10 w-full bg-neutral-900" />

              <div className="mx-4 mt-4 flex justify-end">
                <div className="flex h-8 w-full items-center justify-end rounded-md pr-4" style={{ backgroundColor: '#888888' }}>
                  <p className="font-mono text-sm text-white">
                    {cvv || ''}
                  </p>
                </div>
              </div>
              <p className="self-end pr-4 text-xs font-semibold uppercase opacity-70">CVV</p>

              {backMessage && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl" style={{ marginTop: '-35px' }}>
                  <p className="text-center font-bold text-2xl tracking-wide px-4 bg-transparent" style={{ color: '#ffc700', textShadow: 'none' }}>
                    {backMessage.split(':)').map((part, index, array) => (
                      <React.Fragment key={index}>
                        {part}
                        {index < array.length - 1 && (
                          <span style={{ fontFamily: 'sans-serif', fontWeight: 'normal', color: '#ffc700', position: 'relative', top: '-3px' }}>:)</span>
                        )}
                      </React.Fragment>
                    ))}
                  </p>
                </div>
              )}

              <div className="mt-auto p-4 text-right">
                <svg
                  className="h-8 w-8 ml-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                >
                  <path fill="#ff9800" d="M32 10A14 14 0 1 0 32 38A14 14 0 1 0 32 10Z" />
                  <path fill="#d50000" d="M16 10A14 14 0 1 0 16 38A14 14 0 1 0 16 10Z" />
                  <path
                    fill="#ff3d00"
                    d="M18,24c0,4.755,2.376,8.95,6,11.48c3.624-2.53,6-6.725,6-11.48s-2.376-8.95-6-11.48 C20.376,15.05,18,19.245,18,24z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

FlippableCreditCard.displayName = "FlippableCreditCard";

export { FlippableCreditCard };
