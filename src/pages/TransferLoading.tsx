import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Menu,
  LogOut,
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { safeLocalStorage } from "@/utils/storage";
import { formatCurrency } from "@/utils/currency";
import { decodeHtml } from "@/utils/sanitization";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TransferData {
  bank: string;
  name: string;
  date: Date;
  time: string;
  type: string;
  account: string;
  amount: string;
  currency: string;
  transactionStatus: string;
  startingPercentage: string;
  processingReason: string;
  recipientBank?: string;
  transactionId?: string;
  recipientReference?: string;
  payFromAccount?: string;
  transferMode?: string;
  effectiveDate?: Date;
}

type BankStyle = {
  primary: string;
  bg: string;
  text: string;
  accent: string;
  logo: string;
};

const defaultStyle: BankStyle = {
  primary: "from-slate-500 to-slate-700",
  bg: "bg-slate-50",
  text: "text-slate-800",
  accent: "border-slate-300",
  logo: "/lovable-uploads/c89bdd41-48aa-430e-ac63-da848e1e15cc.png",
};

const styleOverrides: Partial<Record<string, Omit<BankStyle, "logo">>> = {
  "Maybank Berhad": {
    primary: "from-yellow-400 to-yellow-500",
    bg: "bg-yellow-50",
    text: "text-yellow-800",
    accent: "border-yellow-300",
  },
  "CIMB Bank Berhad": {
    primary: "from-red-600 to-red-700",
    bg: "bg-red-50",
    text: "text-red-800",
    accent: "border-red-300",
  },
  "Public Bank Berhad": {
    primary: "from-red-500 to-red-600",
    bg: "bg-red-50",
    text: "text-red-800",
    accent: "border-red-300",
  },
  "RHB Bank Berhad": {
    primary: "from-blue-600 to-blue-700",
    bg: "bg-blue-50",
    text: "text-blue-800",
    accent: "border-blue-300",
  },
  "Hong Leong Bank Berhad": {
    primary: "from-blue-800 to-blue-900",
    bg: "bg-blue-50",
    text: "text-blue-900",
    accent: "border-blue-300",
  },
  "AmBank (M) Berhad": {
    primary: "from-red-500 to-yellow-400",
    bg: "bg-orange-50",
    text: "text-red-700",
    accent: "border-orange-300",
  },
  "Bank Islam Malaysia Berhad": {
    primary: "from-pink-600 to-pink-700",
    bg: "bg-pink-50",
    text: "text-pink-800",
    accent: "border-pink-300",
  },
  "Bank Kerjasama Rakyat Malaysia Berhad (Bank Rakyat)": {
    primary: "from-blue-600 to-orange-500",
    bg: "bg-blue-50",
    text: "text-blue-800",
    accent: "border-blue-300",
  },
  "United Overseas Bank (Malaysia) Bhd (UOB Malaysia)": {
    primary: "from-blue-800 to-blue-900",
    bg: "bg-blue-50",
    text: "text-blue-900",
    accent: "border-blue-300",
  },
  "United Oversea Bank(Malaysia)Bhd": {
    primary: "from-blue-800 to-blue-900",
    bg: "bg-blue-50",
    text: "text-blue-900",
    accent: "border-blue-300",
  },
  "OCBC Bank (Malaysia) Berhad": {
    primary: "from-red-500 to-red-600",
    bg: "bg-red-50",
    text: "text-red-800",
    accent: "border-red-300",
  },
  "OCBC Bank Berhad": {
    primary: "from-red-500 to-red-600",
    bg: "bg-red-50",
    text: "text-red-800",
    accent: "border-red-300",
  },
  "AEON Bank (M) Berhad": {
    primary: "from-purple-500 to-purple-700",
    bg: "bg-purple-50",
    text: "text-purple-800",
    accent: "border-purple-300",
  },
  Agrobank: {
    primary: "from-rose-500 to-rose-700",
    bg: "bg-rose-50",
    text: "text-rose-800",
    accent: "border-rose-300",
  },
  "Affin Bank Berhad": {
    primary: "from-blue-500 to-blue-700",
    bg: "bg-blue-50",
    text: "text-blue-800",
    accent: "border-blue-300",
  },
  "Alliance Bank Malaysia Berhad": {
    primary: "from-indigo-500 to-indigo-700",
    bg: "bg-indigo-50",
    text: "text-indigo-800",
    accent: "border-indigo-300",
  },
  "Bangkok Bank Berhad": {
    primary: "from-blue-700 to-blue-900",
    bg: "bg-blue-50",
    text: "text-blue-900",
    accent: "border-blue-300",
  },
  "Bank Muamalat Malaysia Bhd": {
    primary: "from-orange-500 to-orange-600",
    bg: "bg-orange-50",
    text: "text-orange-700",
    accent: "border-orange-300",
  },
  "Bank Simpanan Nasional Berhad": {
    primary: "from-blue-500 to-blue-700",
    bg: "bg-blue-50",
    text: "text-blue-800",
    accent: "border-blue-300",
  },
  "Boost Bank Berhad": {
    primary: "from-red-500 to-red-600",
    bg: "bg-red-50",
    text: "text-red-800",
    accent: "border-red-300",
  },
  "Citibank Berhad": {
    primary: "from-sky-500 to-sky-700",
    bg: "bg-sky-50",
    text: "text-sky-800",
    accent: "border-sky-300",
  },
  "Deutsche Bank (Malaysia) Berhad": {
    primary: "from-blue-500 to-blue-700",
    bg: "bg-blue-50",
    text: "text-blue-900",
    accent: "border-blue-300",
  },
  "GX BANK BERHAD": {
    primary: "from-teal-500 to-teal-700",
    bg: "bg-teal-50",
    text: "text-teal-800",
    accent: "border-teal-300",
  },
  "HSBC Bank Malaysia Berhad": {
    primary: "from-red-500 to-gray-700",
    bg: "bg-gray-50",
    text: "text-gray-800",
    accent: "border-gray-300",
  },
  "Standard Chartered Bank Malaysia Berhad": {
    primary: "from-emerald-500 to-blue-600",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    accent: "border-emerald-300",
  },
};

const bankLogos: Record<string, string> = {
  "Maybank Berhad": "/lovable-uploads/323134fd-5e09-4850-a809-6dca1be6efb3.png",
  "CIMB Bank Berhad":
    "/lovable-uploads/0818f65c-7b2b-46fe-8732-791fec36b4d7.png",
  "Public Bank Berhad":
    "/lovable-uploads/ecbb9495-68b7-48b9-a9fa-d8ecdde97534.png",
  "RHB Bank Berhad":
    "/lovable-uploads/5df8f1ad-9209-4506-b668-41afc7d9eb84.png",
  "AmBank (M) Berhad": "/lovable-uploads/ambank.png",
  "Bank Islam Malaysia Berhad":
    "/lovable-uploads/b8280e5a-f849-4a72-9355-e2fadbe41075.png",
  "Bank Kerjasama Rakyat Malaysia Berhad (Bank Rakyat)":
    "/lovable-uploads/bankkerjasamarakyat.png",
  "United Oversea Bank(Malaysia)Bhd":
    "/lovable-uploads/94bd47e5-b594-4d2f-962d-ed4f3896a330.png",
  "United Overseas Bank (Malaysia) Bhd (UOB Malaysia)":
    "/lovable-uploads/94bd47e5-b594-4d2f-962d-ed4f3896a330.png",
  "OCBC Bank (Malaysia) Berhad":
    "/lovable-uploads/5621d47e-a40e-4bb3-9479-6c3c84d66151.png",
  "AEON Bank (M) Berhad": "/lovable-uploads/aeonbank.png",
  Agrobank: "/lovable-uploads/agrobank.png",
  "Affin Bank Berhad": "/lovable-uploads/affinbank.png",
  "Al-Rajhi Banking & Investment Corporation (Malaysia) Berhad":
    "/lovable-uploads/aiajhibank.png",
  "Alliance Bank Malaysia Berhad": "/lovable-uploads/alliancebank.png",
  "Axiata Digital Ecode Sdn Bhd - Boost (Non-Bank)":
    "/lovable-uploads/boostbank.png",
  "Bangkok Bank Berhad": "/lovable-uploads/bangkokbank.png",
  "Bank Muamalat Malaysia Bhd": "/lovable-uploads/bankmualamat.png",
  "Bank Simpanan Nasional Berhad": "/lovable-uploads/banksimpanan.png",
  "Bank of America (M) Berhad": "/lovable-uploads/bankofamerica.png",
  "Bank of China (M) Berhad": "/lovable-uploads/bankofchina.png",
  "Beez Fintech Sdn Bhd (Non-Bank)": "/lovable-uploads/beezfintech.png",
  "BigPay Malaysia Sdn Bhd (Non-Bank)": "/lovable-uploads/bigpay.png",
  "BNP Paribas Malaysia Berhad": "/lovable-uploads/bnpparibas.png",
  "Boost Bank Berhad": "/lovable-uploads/boostbank.png",
  "CCBM CHINA CONSTRUCTION BANK": "/lovable-uploads/ccbmchina.png",
  "China Construction Bank (Malaysia) Berhad":
    "/lovable-uploads/chinaconstructionbank.png",
  "Citibank Berhad": "/lovable-uploads/citibank.png",
  "Co-opbank Pertama": "/lovable-uploads/coopbank.png",
  "Deutsche Bank (Malaysia) Berhad": "/lovable-uploads/deutschebank.png",
  "Fass Payment Solutions Sdn Bhd (Non-Bank)": "/lovable-uploads/fasspay.png",
  "Fave Asia Technologies Snd Bhd (Non-Bank)": "/lovable-uploads/faveasia.png",
  "Finexus Cards Sdn Bhd (Non-Bank)": "/lovable-uploads/finexus.png",
  "GHL Cardpay Sdn Bhd (Non-Bank)": "/lovable-uploads/ghlcard.png",
  "Gpay Network (M) Sdn Bhd - Grab (Non-Bank)": "/lovable-uploads/gpay.png",
  "GX BANK BERHAD": "/lovable-uploads/gxbank.png",
  "HSBC Bank Malaysia Berhad": "/lovable-uploads/hsbcbank.png",
  "Hong Leong Bank Berhad": "/lovable-uploads/hongleong.png",
  "Industrial and Commercial Bank of China (M) Berhad":
    "/lovable-uploads/industrialandcommercialbankchina.png",
  "IPAY88 (M) Sdn Bhd (Non-Bank)": "/lovable-uploads/ipay88.png",
  "JP Morgan Chase Bank Berhad": "/lovable-uploads/jpmorgan.png",
  "KAF Digital Bank Berhad": "/lovable-uploads/kafdigitalbank.png",
  "Kuwait Finance House": "/lovable-uploads/kuwaitfinance.png",
  "MBSB Bank Berhad": "/lovable-uploads/mbsbbank.png",
  "Merchanttrade Asia Sdn Bhd (Non-Bank)": "/lovable-uploads/merchanttrade.jpg",
  "Mizuho Bank (Malaysia) Berhad": "/lovable-uploads/mizuho.png",
  "MobilityOne Sdn Bhd (Non-Bank)": "/lovable-uploads/merchanttrade.jpg",
  "MUFG Bank (Malaysia) Berhad": "/lovable-uploads/bankofamerica.png",
  "OCBC Bank Berhad":
    "/lovable-uploads/5621d47e-a40e-4bb3-9479-6c3c84d66151.png",
  "Payex PLT (Non-Bank)": "/lovable-uploads/merchanttrade.jpg",
  "Razer Merchant Services Sdn Bhd (Non-Bank)": "/lovable-uploads/razerpay.svg",
  "Revenue Solution Sdn Bhd (Non-Bank)": "/lovable-uploads/finexus.png",
  "Ryt Bank": "/lovable-uploads/rytbank.png",
  "Setel Pay Sdn Bhd (Non-Bank)": "/lovable-uploads/beezfintech.png",
  "ShopeePay (Non-Bank)": "/lovable-uploads/shopeepay.png",
  "SiliconNet Technologies Sdn Bhd (Non-Bank)": "/lovable-uploads/finexus.png",
  "Standard Chartered Bank Malaysia Berhad":
    "/lovable-uploads/standardcharteres.png",
  "Sumitomo Mitsui Banking Corporation (M) Berhad":
    "/lovable-uploads/mizuho.png",
  "TNG Digital - Touch'n GO (Non-Bank)": "/lovable-uploads/tngdigital.jpg",
};

const getBankStyle = (bank: string): BankStyle => {
  const override = styleOverrides[bank];
  const logo = bankLogos[bank] || defaultStyle.logo;
  if (override) {
    return { ...defaultStyle, ...override, logo };
  }
  return { ...defaultStyle, logo };
};

const TransferLoading = () => {
  const navigate = useNavigate();
  const [transferData, setTransferData] = useState<TransferData | null>(null);
  const [progress, setProgress] = useState(64);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showCimbDetails, setShowCimbDetails] = useState(false);

  useEffect(() => {
    // Get transfer data from localStorage
    const data = safeLocalStorage.getJSON<TransferData>("transferData");
    if (!data) {
      navigate("/");
      return;
    }

    const parsedData = { ...data };
    parsedData.date = new Date(parsedData.date);
    if (parsedData.effectiveDate) {
      parsedData.effectiveDate = new Date(parsedData.effectiveDate);
    }
    setTransferData(parsedData);

    // Set initial progress based on status and startingPercentage
    if (parsedData.transactionStatus === "Processing") {
      const initialProgress = parseInt(parsedData.startingPercentage) || 64;
      setProgress(initialProgress);

      // Start progress increment every 30 seconds for Processing status
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, 30000);

      return () => clearInterval(interval);
    } else {
      // For Cancelled and Successful, set progress to 100
      setProgress(100);
    }
  }, [navigate]);

  useEffect(() => {
    // Handle Escape key press
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowExitDialog(true);
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, []);

  const handleExitConfirm = () => {
    navigate("/");
  };

  const formatDateTime = (date: Date, time: string, bank?: string) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    if (bank?.toLowerCase() === "maybank berhad") {
      return `${year}-${month}-${day}T${time}:00`;
    }
    return `${year}-${month}-${day} ${time}`;
  };

  const combineDateWithTime = (date: Date, time: string) => {
    if (!time) {
      return new Date(date);
    }
    const [hours = "0", minutes = "0", seconds = "0"] = time.split(":");
    const combined = new Date(date);
    combined.setHours(
      Number(hours) || 0,
      Number(minutes) || 0,
      Number(seconds) || 0,
      0
    );
    return combined;
  };

  const formatCimbTimestamp = (
    date: Date,
    time: string,
    options?: { includeComma?: boolean }
  ) => {
    const includeComma = options?.includeComma ?? true;
    const combined = combineDateWithTime(date, time);
    const formatter = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "Asia/Kuala_Lumpur",
    });
    let formatted = formatter.format(combined);
    if (!includeComma) {
      formatted = formatted.replace(",", "");
    }
    return formatted;
  };

  const getStatusIcon = (status: string, style: BankStyle) => {
    switch (status) {
      case "Cancelled":
        return <XCircle className={`w-24 h-24 ${style.text}`} />;
      case "Successful":
        return <CheckCircle className={`w-24 h-24 ${style.text}`} />;
      case "Processing":
      default:
        return (
          <div className="relative inline-block">
            <Loader2 className={`w-24 h-24 ${style.text} animate-spin`} />
            <div
              className={`absolute inset-0 flex items-center justify-center text-2xl font-bold ${style.text}`}
            >
              {progress}%
            </div>
          </div>
        );
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "Cancelled":
        return "Transfer Cancelled";
      case "Successful":
        return "Transfer Completed Successfully";
      case "Processing":
      default:
        return "Loading Transfer Status...";
    }
  };

  const getProgressSteps = (
    status: string,
    progress: number,
    style: BankStyle
  ) => {
    switch (status) {
      case "Cancelled":
        return (
          <div className={`text-sm ${style.text} space-y-1`}>
            <div className="flex justify-between">
              <span>✗ Transaction cancelled</span>
              <span>Cancelled</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>⏳ Processing payment</span>
              <span>Stopped</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>⏳ Confirming transaction</span>
              <span>Stopped</span>
            </div>
          </div>
        );
      case "Successful":
        return (
          <div className={`text-sm ${style.text} space-y-1`}>
            <div className="flex justify-between">
              <span>✓ Validating account details</span>
              <span>Complete</span>
            </div>
            <div className="flex justify-between">
              <span>✓ Processing payment</span>
              <span>Complete</span>
            </div>
            <div className="flex justify-between">
              <span>✓ Confirming transaction</span>
              <span>Complete</span>
            </div>
            {transferData &&
              transferData.processingReason &&
              transferData.bank !== "Maybank Berhad" && (
                <div className="mt-2 p-2 bg-gray-50 rounded border">
                  <div className="text-xs text-gray-600 mb-1">
                    Processing Reason:
                  </div>
                  <div className="text-sm font-medium">
                    {decodeHtml(transferData.processingReason)}
                  </div>
                </div>
              )}
          </div>
        );
      case "Processing":
      default:
        return (
          <div className={`text-sm ${style.text} space-y-1`}>
            <div className="flex justify-between">
              <span>✓ Validating account details</span>
              <span>Complete</span>
            </div>
            <div className="flex justify-between">
              <span>✓ Processing payment</span>
              <span>Complete</span>
            </div>
            <div className="flex justify-between">
              <span className={progress > 80 ? "" : "text-gray-500"}>
                {progress > 80 ? "✓" : "⏳"} Confirming transaction
              </span>
              <span className={progress > 80 ? "" : "text-gray-500"}>
                {progress > 80 ? "Complete" : "In Progress"}
              </span>
            </div>
            {transferData &&
              transferData.processingReason &&
              transferData.bank !== "Maybank Berhad" && (
                <div className="mt-2 p-2 bg-gray-50 rounded border">
                  <div className="text-xs text-gray-600 mb-1">
                    Processing Reason:
                  </div>
                  <div className="text-sm font-medium">
                    {decodeHtml(transferData.processingReason)}
                  </div>
                </div>
              )}
          </div>
        );
    }
  };

  if (!transferData) return null;

  // Decode all text fields that may contain HTML entities
  const decodedBank = decodeHtml(transferData.bank);
  const decodedRecipientBank = decodeHtml(transferData.recipientBank);
  const decodedName = decodeHtml(transferData.name);
  const decodedType = decodeHtml(transferData.type);
  const decodedProcessingReason = decodeHtml(transferData.processingReason);
  const decodedTransactionId = decodeHtml(transferData.transactionId);
  const decodedRecipientReference = decodeHtml(transferData.recipientReference);
  const decodedPayFromAccount = decodeHtml(transferData.payFromAccount);
  const decodedTransferMode = decodeHtml(transferData.transferMode);

  const style = getBankStyle(transferData.bank);
  const isCIMB = transferData.bank === "CIMB Bank Berhad";

  const exitDialog = (
    <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
      <AlertDialogContent className="mx-4 sm:mx-auto max-w-md sm:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg sm:text-xl">
            Confirm Navigation
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm sm:text-base">
            Are you sure you want to leave this page and return to the fill-up
            form? Your current transfer data will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <AlertDialogCancel className="w-full sm:w-auto">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleExitConfirm}
            className="w-full sm:w-auto"
          >
            Yes, Go Back
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  const getCimbStatusMeta = (status: string) => {
    const normalized = status?.toLowerCase();
    switch (normalized) {
      case "successful":
        return {
          label: "Successful",
          icon: <CheckCircle className="h-4 w-4 text-[#1b7a4a]" />,
          badgeClasses: "bg-[#eaf7f0] text-[#1b7a4a]",
          description: "Transaction completed successfully.",
        };
      case "cancelled":
        return {
          label: "Failed",
          icon: <XCircle className="h-4 w-4 text-[#b91c1c]" />,
          badgeClasses: "bg-[#fde4e4] text-[#b91c1c]",
          description:
            "Transaction declined by receiving bank. Please check with your recipient.",
        };
      default:
        return {
          label: "Processing",
          icon: <Loader2 className="h-4 w-4 text-[#b45309] animate-spin" />,
          badgeClasses: "bg-[#ffe9d6] text-[#b45309]",
          description:
            "Transfer is currently being processed. Please wait for completion.",
        };
    }
  };

  if (isCIMB) {
    const statusMeta = getCimbStatusMeta(transferData.transactionStatus);
    const formattedTimestamp = formatCimbTimestamp(
      transferData.date,
      transferData.time
    );
    const amountDisplay = formatCurrency(transferData.amount).replace(
      /^RM/,
      "MYR "
    );
    const totalAmountDisplay = formatCurrency(transferData.amount).replace(
      /^RM/,
      "MYR "
    );
    const accountWithHyphen = transferData.account.replace(
      /(\d{4})(?=\d)/g,
      "$1-"
    );

    return (
      <>
        <div className="min-h-screen bg-white text-[#222]">
          <header>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
              <button
                type="button"
                className="h-10 w-10 rounded-full flex items-center justify-center text-[#c21d16]"
                onClick={() => setShowCimbDetails((prev) => !prev)}
                aria-label="Toggle menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <img
                src="/lovable-uploads/cimbheaderlogo.png"
                alt="CIMB Clicks"
                className="h-8 object-contain"
              />
              <div className="flex items-center gap-4 text-xs sm:text-sm text-[#c21d16]">
                <a
                  href="#mail"
                  className="hidden sm:flex items-center gap-1 hover:text-[#a5150f] transition"
                >
                  Mailbox
                  <img
                    src="/lovable-uploads/mail.png"
                    alt="Mailbox"
                    className="h-4 w-5 object-contain"
                  />
                </a>
                <button
                  type="button"
                  onClick={() => setShowExitDialog(true)}
                  className="flex items-center gap-1 hover:text-[#a5150f] transition"
                >
                  Logout
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </header>

          <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-[#222]">
                  DuitNow / Transfer Money Acknowledgement
                </h1>
              </div>
              <button
                type="button"
                className="h-10 w-10 flex items-center justify-center rounded-full border border-[#e0e0e0] text-[#555]"
                aria-label="More options"
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>

            <section className="rounded-2xl border border-[#dedede] overflow-hidden shadow-sm bg-white">
              <div className="bg-[#f1f1f1] px-6 py-5 text-sm">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-[#b71d1d] font-semibold">
                      <span className="flex items-center justify-center h-6 w-6 rounded-full bg-white shadow-inner">
                        {statusMeta.icon}
                      </span>
                      <span className="uppercase tracking-wide">{statusMeta.label}</span>
                      <span className="text-[#555] font-normal">Ref</span>
                      <span className="font-semibold text-[#222] font-mono">
                        {decodedTransactionId || "—"}
                      </span>
                    </div>
                    <p className="text-[#444] italic">
                      {decodeHtml(transferData.processingReason || statusMeta.description)}
                    </p>
                    {transferData.recipientReference && (
                      <p className="text-[#777] text-xs">
                        [{decodeHtml(transferData.recipientReference)}]
                      </p>
                    )}
                  </div>
                  <div className="text-sm text-[#444] font-medium whitespace-nowrap">
                    {formattedTimestamp}
                  </div>
                </div>
              </div>

              <div className="bg-[#f6f6f6] px-6 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-[2fr_auto] gap-6">
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-sm font-semibold text-[#111] uppercase tracking-[0.12em]">
                        To
                      </h2>
                      <div className="mt-2 space-y-3 text-sm leading-relaxed text-[#333]">
                        <div>
                          <p className="uppercase text-xs tracking-[0.18em] text-[#777]">
                            Account Number
                          </p>
                          <p className="font-semibold text-lg text-[#111] font-mono">
                            {accountWithHyphen}
                          </p>
                        </div>
                        <div>
                          <p className="uppercase text-xs tracking-[0.18em] text-[#777]">
                            Recipient Name
                          </p>
                          <p className="font-semibold text-base text-[#111] uppercase">
                            {decodedName}
                          </p>
                        </div>
                        {transferData.recipientBank && (
                          <div>
                            <p className="uppercase text-xs tracking-[0.18em] text-[#777]">
                              Recipient Bank
                            </p>
                            <p className="font-medium text-sm text-[#333]">
                              {decodedRecipientBank}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCimbDetails((prev) => !prev)}
                      className="text-sm font-semibold text-[#c21d16] inline-flex items-center gap-2"
                    >
                      {showCimbDetails
                        ? "Less transfer details"
                        : "More transfer details"}{" "}
                      <ChevronRight
                        className={`h-4 w-4 transition-transform ${
                          showCimbDetails ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                  </div>

                  <div className="text-right space-y-2">
                    <div>
                      <p className="uppercase text-sm font-semibold text-[#111]">
                        Amount
                      </p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[#111]">
                        {amountDisplay}
                      </p>
                      <p className="text-xs text-[#555]">
                        Bank charges{" "}
                        <span className="font-semibold">MYR 0.00</span>
                      </p>
                    </div>
                  </div>
                </div>

                {showCimbDetails && (
                  <div className="mt-6 border-t border-[#dedede] pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-[#333]">
                    <div>
                      <p className="uppercase text-xs tracking-[0.18em] text-[#777]">
                        From
                      </p>
                      <p className="mt-2 font-semibold text-[#111]">
                        {decodedPayFromAccount || "Account not specified"}
                      </p>
                      <p className="text-xs text-[#666] font-mono mt-1">
                        {accountWithHyphen}
                      </p>
                    </div>
                    <div>
                      <p className="uppercase text-xs tracking-[0.18em] text-[#777]">
                        Transfer Method
                      </p>
                      <p className="mt-2 font-semibold text-[#111]">
                        {decodedTransferMode ||
                          decodedType ||
                          "DuitNow Transfer"}
                      </p>
                    </div>
                    {transferData.processingReason && (
                      <div className="sm:col-span-2">
                        <p className="uppercase text-xs tracking-[0.18em] text-[#777]">
                          Processing Reason
                        </p>
                        <p className="mt-2 text-[#333]">
                          {decodeHtml(transferData.processingReason)}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-[#e4e4e4] bg-[#f7f7f7] px-6 py-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#111] uppercase tracking-[0.12em]">
                Total
              </h2>
              <div className="text-right text-lg font-bold text-[#111]">
                {totalAmountDisplay}
              </div>
            </section>

            <section className="rounded-2xl border border-[#efe7c7] bg-[#fbf6d9] px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-3">
                <p className="text-sm font-semibold text-[#111] uppercase tracking-[0.12em]">
                  Available Balance After Transaction
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded bg-[#c21d16] text-white flex items-center justify-center text-lg font-semibold">
                    C
                  </div>
                  <div className="text-sm text-[#111] space-y-1">
                    <p className="font-semibold uppercase">BASIC SA WITHOUT FEE</p>
                    <p className="font-mono text-xs text-[#333]">
                      7076892134 <span className="font-semibold">MYR 230,342.68</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-[#111] uppercase tracking-[0.12em]">
                  Next Steps
                </p>
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 text-sm font-semibold text-[#c21d16]">
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="inline-flex items-center gap-2 hover:text-[#a5150f] transition"
                  >
                    <span>↻</span>
                    <span>Make Another Transfer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/transfer-history")}
                    className="inline-flex items-center gap-2 hover:text-[#a5150f] transition"
                  >
                    <span>💳</span>
                    <span>Go to My Accounts</span>
                  </button>
                </div>
              </div>
            </section>

            <section>
              <img
                src="/lovable-uploads/banner-cmp.png"
                alt="CIMB promotional banner"
                className="w-full rounded-2xl border border-[#dedede]"
              />
            </section>
          </main>
        </div>
        {exitDialog}
      </>
    );
  }

  return (
    <>
      <div className={`min-h-screen ${style.bg} p-2 sm:p-4`}>
        <div className="max-w-7xl mx-auto pt-4 sm:pt-8">
          {/* Header */}
          <div
            className={`bg-gradient-to-r ${style.primary} text-white p-4 sm:p-6 lg:p-8 rounded-t-xl shadow-lg`}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-white rounded-xl shadow-md flex items-center justify-center">
                  <img
                    src={style.logo}
                    alt={`${decodedBank} Logo`}
                    className="w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 object-contain"
                    onError={(e) => {
                      // Fallback to generic bank icon if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      target.parentElement!.innerHTML = "🏦";
                      target.parentElement!.className +=
                        " text-2xl sm:text-3xl lg:text-5xl";
                    }}
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold">
                    Fund Transferring
                  </h1>
                  <p className="text-white/90 text-sm sm:text-base lg:text-lg">
                    Secure Transaction in Progress
                  </p>
                </div>
              </div>
              <div className="text-center sm:text-right">
                <div className="text-xs sm:text-sm text-white/80">
                  Transaction ID
                </div>
                <div className="font-mono text-sm sm:text-base lg:text-lg">
                  #TXN-{Date.now().toString().slice(-8)}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 -mt-2">
            {/* Loading Section */}
            <Card
              className={`${style.accent} border-2 bg-white/80 backdrop-blur-sm shadow-xl order-2 xl:order-1`}
            >
              <CardContent className="p-4 sm:p-6 lg:p-8 text-center">
                <div className="mb-6 sm:mb-8">
                  {getStatusIcon(transferData.transactionStatus, style)}
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <h2
                    className={`text-lg sm:text-xl lg:text-2xl font-semibold ${style.text}`}
                  >
                    {getStatusText(transferData.transactionStatus)}
                  </h2>

                  {transferData.transactionStatus === "Processing" && (
                    <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4">
                      <div
                        className={`bg-gradient-to-r ${style.primary} h-3 sm:h-4 rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  )}

                  <div className="text-left">
                    {getProgressSteps(
                      transferData.transactionStatus,
                      progress,
                      style
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transfer Details */}
            <Card
              className={`${style.accent} border-2 bg-white/80 backdrop-blur-sm shadow-xl order-1 xl:order-2`}
            >
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <h3
                  className={`text-lg sm:text-xl lg:text-2xl font-semibold ${style.text} mb-4 sm:mb-6 flex items-center gap-2`}
                >
                  <span className="text-lg sm:text-xl">📋</span> Transfer
                  Details
                </h3>

                <div className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-gray-600">
                        Recipient Bank
                      </label>
                      <p
                        className={`font-semibold ${style.text} text-sm sm:text-base lg:text-lg mt-1`}
                      >
                        {decodedRecipientBank || decodedBank}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-gray-600">
                        Transfer Type
                      </label>
                      <p
                        className={`font-semibold ${style.text} text-sm sm:text-base lg:text-lg mt-1`}
                      >
                        {decodedType}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-600">
                      Transferer Name
                    </label>
                    <p
                      className={`font-semibold ${style.text} text-base sm:text-lg lg:text-xl mt-1`}
                    >
                      {decodedName}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-600">
                      Date & Time
                    </label>
                    <p
                      className={`font-semibold ${style.text} font-mono text-sm sm:text-base lg:text-lg mt-1 break-all sm:break-normal`}
                    >
                      {formatDateTime(
                        transferData.date,
                        transferData.time,
                        transferData.recipientBank || transferData.bank
                      )}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-600">
                      Account Number
                    </label>
                    <p
                      className={`font-mono font-semibold ${style.text} text-base sm:text-lg lg:text-xl mt-1 break-all sm:break-normal`}
                    >
                      {transferData.account.replace(/(\d{4})(?=\d)/g, "$1-")}
                    </p>
                  </div>

                  <div
                    className={`bg-gradient-to-r ${style.primary} p-3 sm:p-4 lg:p-6 rounded-lg text-white`}
                  >
                    <label className="text-xs sm:text-sm font-medium text-white/80">
                      Transfer Amount
                    </label>
                    <p className="font-bold text-xl sm:text-2xl lg:text-3xl xl:text-4xl mt-1 break-words">
                      {formatCurrency(transferData.amount)}
                    </p>
                  </div>

                  <div
                    className={`border-2 ${style.accent} p-3 sm:p-4 rounded-lg ${style.bg}`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-0">
                      <span className="font-medium text-gray-700 text-sm sm:text-base">
                        Transaction Status:
                      </span>
                      <span
                        className={`font-bold ${style.text} uppercase tracking-wide text-sm sm:text-base lg:text-lg`}
                      >
                        {transferData.transactionStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security Notice */}
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
            <p className="text-xs sm:text-sm text-gray-600 text-center leading-relaxed">
              🔒 This transaction is secured with bank-grade encryption. Press
              ESC to go back to fill-up page.
            </p>
          </div>
        </div>
      </div>

      {exitDialog}
    </>
  );
};

export default TransferLoading;
