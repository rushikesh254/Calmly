import { motion } from "framer-motion";
import { Loader2, Heart } from "lucide-react";

const LoadingSpinner = ({
	size = "default",
	text = "Loading...",
	showIcon = true,
}) => {
	const sizeClasses = {
		sm: "w-8 h-8",
		default: "w-12 h-12",
		lg: "w-16 h-16",
		xl: "w-20 h-20",
	};

	const textSizes = {
		sm: "text-sm",
		default: "text-base",
		lg: "text-lg",
		xl: "text-xl",
	};

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.8 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.5 }}
			className="flex flex-col items-center justify-center space-y-4">
			<motion.div
				animate={{ rotate: 360 }}
				transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
				className={`${sizeClasses[size]} bg-gradient-to-r from-indigo-600 to-teal-500 rounded-full flex items-center justify-center shadow-lg`}>
				{showIcon ? (
					<Heart className="w-1/2 h-1/2 text-white" />
				) : (
					<Loader2 className="w-1/2 h-1/2 text-white" />
				)}
			</motion.div>
			{text && (
				<motion.p
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className={`${textSizes[size]} text-slate-600 dark:text-slate-400 font-medium`}>
					{text}
				</motion.p>
			)}
		</motion.div>
	);
};

const LoadingPage = ({
	text = "Loading...",
	subtitle = "Please wait while we prepare your experience",
}) => {
	return (
		<div className="min-h-dvh bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
			<motion.div
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5 }}
				className="text-center space-y-6">
				<motion.div
					animate={{ rotate: 360 }}
					transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
					className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-teal-500 rounded-full flex items-center justify-center mx-auto shadow-xl">
					<Heart className="w-8 h-8 text-white" />
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="text-xl text-slate-600 dark:text-slate-400 font-medium">
					{text}
				</motion.div>
				{subtitle && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5, delay: 0.4 }}
						className="text-sm text-slate-500 dark:text-slate-500">
						{subtitle}
					</motion.div>
				)}
			</motion.div>
		</div>
	);
};

const LoadingCard = ({ text = "Loading..." }) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="flex items-center justify-center p-8">
			<LoadingSpinner size="default" text={text} />
		</motion.div>
	);
};

export { LoadingSpinner, LoadingPage, LoadingCard };
