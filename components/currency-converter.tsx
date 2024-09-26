"use client"; // Add this line to make the component a Client Component

import { useState, useEffect, ChangeEvent } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import ClipLoader from "react-spinners/ClipLoader";

// Define types
type ExchangeRates = { [key: string]: number };
type Currency =
  | "USD"
  | "EUR"
  | "GBP"
  | "JPY"
  | "AUD"
  | "CAD"
  | "PKR"
  | "INR"
  | "CHF"
  | "CNY"
  | "NZD"
  | "SGD"
  | "HKD"
  | "NOK"
  | "SEK"
  | "MXN"
  | "BRL"
  | "RUB"
  | "ZAR";

// Currency flags mapping
const currencyFlags: { [key in Currency]: string } = {
  USD: "https://flagcdn.com/us.svg",
  EUR: "https://flagcdn.com/eu.svg",
  GBP: "https://flagcdn.com/gb.svg",
  JPY: "https://flagcdn.com/jp.svg",
  AUD: "https://flagcdn.com/au.svg",
  CAD: "https://flagcdn.com/ca.svg",
  PKR: "https://flagcdn.com/pk.svg",
  INR: "https://flagcdn.com/in.svg",
  CHF: "https://flagcdn.com/ch.svg",
  CNY: "https://flagcdn.com/cn.svg",
  NZD: "https://flagcdn.com/nz.svg",
  SGD: "https://flagcdn.com/sg.svg",
  HKD: "https://flagcdn.com/hk.svg",
  NOK: "https://flagcdn.com/no.svg",
  SEK: "https://flagcdn.com/se.svg",
  MXN: "https://flagcdn.com/mx.svg",
  BRL: "https://flagcdn.com/br.svg",
  RUB: "https://flagcdn.com/ru.svg",
  ZAR: "https://flagcdn.com/za.svg",
};

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<number | null>(null);
  const [sourceCurrency, setSourceCurrency] = useState<Currency>("USD");
  const [targetCurrency, setTargetCurrency] = useState<Currency>("PKR");
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const [convertedAmount, setConvertedAmount] = useState<string>("0.00");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // Error state

  // Fetch exchange rates on mount
  useEffect(() => {
    const fetchExchangeRates = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://v6.exchangerate-api.com/v6/${process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY}/latest/USD`
        );
        const data = await response.json();
        setExchangeRates(data.conversion_rates);
      } catch (error) {
        setError("Error fetching exchange rates."); // Handle error
      } finally {
        setLoading(false);
      }
    };
    fetchExchangeRates();
  }, []);

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setAmount(parseFloat(e.target.value));
  };

  const handleSourceCurrencyChange = (value: Currency): void => {
    setSourceCurrency(value);
  };

  const handleTargetCurrencyChange = (value: Currency): void => {
    setTargetCurrency(value);
  };

  const calculateConvertedAmount = (): void => {
    if (sourceCurrency && targetCurrency && amount && exchangeRates) {
      const rate =
        sourceCurrency === "USD"
          ? exchangeRates[targetCurrency]
          : exchangeRates[targetCurrency] / exchangeRates[sourceCurrency];
      const result = amount * rate;
      setConvertedAmount(result.toFixed(2));
    }
  };

  const swapCurrencies = () => {
    setSourceCurrency(targetCurrency);
    setTargetCurrency(sourceCurrency);
    calculateConvertedAmount();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[url('https://media.istockphoto.com/id/1145626155/photo/3d-render-neon-light-abstract-background-round-portal-rings-circles-virtual-reality.jpg?s=612x612&w=0&k=20&c=j1dB5brpHkaosjDBhDcJOtcA7X0TqtWIs7CqPAhoFpo=')] bg-no-repeat bg-cover bg-fixed  p-3 ">
      <Card className="w-full max-w-md p-4 pt-7 space-y-4 bg-transparent  backdrop-blur-xl ">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-[1.3rem] font-bold pb-3 uppercase text-gray-100">
            Currency Converter
          </CardTitle>
          <CardDescription className="text-gray-400">
            Convert between different currencies.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center">
              <ClipLoader className="w-6 h-6 text-blue-500" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div> // Display error if there's any
          ) : (
            <div className="grid gap-8">
              <div>
                <Label className="mb-4 text-md text-white " htmlFor="amount">
                  Enter Amount
                </Label>
                <Input
                  type="number"
                  placeholder="Amount"
                  value={amount || ""}
                  onChange={handleAmountChange}
                  className="w-full bg-[rgba(255,255,255,0.13)] backdrop-blur-3xl text-md text-white "
                  id="amount"
                />
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center w-full justify-between">
                  <Select
                    value={sourceCurrency}
                    onValueChange={handleSourceCurrencyChange}
                  >
                    <SelectTrigger className="w-md px-[9px] bg-[rgba(255,255,255,0.13)] backdrop-blur-3xl text-md text-white ">
                      <SelectValue placeholder="USD" />
                    </SelectTrigger>
                    <SelectContent className="h-[200px]">
                      <SelectGroup>
                        {Object.entries(currencyFlags).map(
                          ([currency, flagUrl]) => (
                            <SelectItem key={currency} value={currency}>
                              <div className="flex items-center">
                                <img
                                  src={flagUrl}
                                  alt={`${currency} flag`}
                                  className="w-5 h-5 mr-2"
                                />
                                {currency}
                              </div>
                            </SelectItem>
                          )
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {/* Swap Icon */}
                  <div
                    className="mx-3 cursor-pointer  bg-[rgba(255,255,255,0.2)] backdrop-blur-3xl text-md text-white rounded-full p-[6px] border border-white"
                    onClick={swapCurrencies}
                  >
                    <svg
                      width="12"
                      viewBox="0 0 20 19"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.13 11.66H.22a.22.22 0 0 0-.22.22v1.62a.22.22 0 0 0 .22.22h16.45l-3.92 4.94a.22.22 0 0 0 .03.3l1.26.99c.1.08.24.07.32-.03l5.39-6.79a.22.22 0 0 0-.17-.36zM.87 7.34h18.91c.12 0 .22-.1.22-.22V5.5a.22.22 0 0 0-.22-.22H2.32l3.92-4.94A.22.22 0 0 0 6.2.03L4.94-.96C4.84-1.04 4.7-1.03 4.62-.93L.23 5.86a.22.22 0 0 0 .17.36z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <Select
                    value={targetCurrency}
                    onValueChange={handleTargetCurrencyChange}
                  >
                    <SelectTrigger className="w-md px-[9px] bg-[rgba(255,255,255,0.13)] backdrop-blur-3xl text-md text-white ">
                      <SelectValue placeholder="PKR" />
                    </SelectTrigger>
                    <SelectContent className="h-[200px]">
                      <SelectGroup>
                        {Object.entries(currencyFlags).map(
                          ([currency, flagUrl]) => (
                            <SelectItem key={currency} value={currency}>
                              <div className="flex items-center">
                                <img
                                  src={flagUrl}
                                  alt={`${currency} flag`}
                                  className="w-5 h-5 mr-2"
                                />
                                {currency}
                              </div>
                            </SelectItem>
                          )
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={calculateConvertedAmount}
            disabled={!amount || loading}
            className="w-full text-md font-bold bg-[rgba(255,255,255,0.13)] backdrop-blur-3xl text-white"
          >
            {loading ? "Loading..." : "Convert"}
          </Button>
          <div className="mt-4 text-center">
            <p className="text-md font-bold text-white">Converted Amount:</p>
            <p className="text-md font-bold text-white">{convertedAmount}</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
