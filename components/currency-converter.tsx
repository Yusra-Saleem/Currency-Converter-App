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
import Image from 'next/image';

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

  // Fetch exchange rates on mount
  useEffect(() => {
    const fetchExchangeRates = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://v6.exchangerate-api.com/v6/${process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY}/latest/USD`
        );
        const data = await response.json();
        setExchangeRates(data.conversion_rates);
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
    calculateConvertedAmount(); // Optionally, recalculate the converted amount after swapping
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[url('https://media.istockphoto.com/id/1145626155/photo/3d-render-neon-light-abstract-background-round-portal-rings-circles-virtual-reality.jpg?s=612x612&w=0&k=20&c=j1dB5brpHkaosjDBhDcJOtcA7X0TqtWIs7CqPAhoFpo=')] bg-no-repeat bg-cover bg-fixed  p-3 ">
      <Card className="w-full max-w-md p-4 pt-7 space-y-4 bg-transparent  backdrop-blur-xl ">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-[1.3rem] font-bold pb-3 uppercase text-gray-100">Currency Converter</CardTitle>
          <CardDescription className="text-gray-400">Convert between different currencies.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center">
              <ClipLoader className="w-6 h-6 text-blue-500" />
            </div>
          ) : (
            <div className="grid gap-8">
              <div>
                <Label className="mb-4 text-md text-white " htmlFor="amount">Enter Amount</Label>
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
                  
                  <Select value={sourceCurrency} onValueChange={handleSourceCurrencyChange}>
                    <SelectTrigger className="w-md px-[9px] bg-[rgba(255,255,255,0.13)] backdrop-blur-3xl text-md text-white ">
                      <SelectValue placeholder="USD" />
                    </SelectTrigger>
                    <SelectContent className="h-[200px]">
                      <SelectGroup>
                        {Object.entries(currencyFlags).map(([currency, flagUrl]) => (
                          <SelectItem key={currency} value={currency}>
                            <div className="flex items-center">
                              <Image src={flagUrl} alt={`${currency} flag`} width={20} height={20} className="mr-2" />
                              {currency}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  
                  {/* Swap Icon */}
                  <div className="mx-3 cursor-pointer  bg-[rgba(255,255,255,0.2)] backdrop-blur-3xl text-md text-white rounded-full p-[6px] border border-white" onClick={swapCurrencies}>
                    <svg width="12" viewBox="0 0 20 19" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M19.13 11.66H.22a.22.22 0 0 0-.22.22v1.62a.22.22 0 0 0 .22.22h16.45l-3.92 4.94a.22.22 0 0 0 .17.35h1.97c.13 0 .25-.06.33-.16l4.59-5.78a.9.9 0 0 0-.7-1.43zM19.78 5.29H3.34L7.26.35A.22.22 0 0 0 7.09 0H5.12a.22.22 0 0 0-.34.16L.19 5.94a.9.9 0 0 0 .68 1.4H19.78a.22.22 0 0 0 .22-.22V5.51a.22.22 0 0 0-.22-.22z"
                        fill="white"
                      />
                    </svg>
                  </div>

                  <Select value={targetCurrency} onValueChange={handleTargetCurrencyChange}>
                    <SelectTrigger className="w-md px-[9px] bg-[rgba(255,255,255,0.13)] backdrop-blur-3xl text-md text-white">
                      <SelectValue placeholder="PKR" />
                    </SelectTrigger>
                    <SelectContent className="h-[200px]">
                      <SelectGroup>
                        {Object.entries(currencyFlags).map(([currency, flagUrl]) => (
                          <SelectItem key={currency} value={currency}>
                            <div className="flex items-center">
                              <Image src={flagUrl} alt={`${currency} flag`} width={20} height={20} className="mr-2" />
                              {currency}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="button" className="w-full bg-gray-100 text-slate-900 font-semibold" onClick={calculateConvertedAmount}>
                  Get Exchange Rate
                </Button>
              <div className="grid grid-cols-[1fr_auto] items-center gap-2 text-gray-200 px-3">
                  <Label htmlFor="to" className=" text-white text-lg">Converted Amount</Label>
                  <div className="text-2xl font-bold">{convertedAmount}</div>
                </div>
            </div>   
          )}
         <div className="w-full m-7 ">
          {convertedAmount && (
            <p className="text-md w-full text-center text-xl text-white ">
              {`${amount}   ${sourceCurrency} = ${convertedAmount}   ${targetCurrency}`}
            </p>       
          )}
           </div>
          </CardContent>
        <CardFooter className="flex justify-between items-center ">
          <div className="text-sm text-center  text-white">Made by Yusra Saleem</div>
        </CardFooter>
      </Card>
    </div>





    
  );
}

