/**
 * Root Layout Component for Calmly Mental Health Platform
 * @author Rushikesh Bodke
 */
import "./globals.css";
import { ThemeProvider as AppThemeProvider } from "@/components/theme-provider";

export const metadata = {
	title: "Calmly - Mental Health Platform",
	description:
		"A comprehensive mental health platform for therapy, resources, and support",
	keywords: ["mental health", "therapy", "wellness", "counseling"],
	author: "Rushikesh Bodke",
};

export default function AppRootLayout({ children: appContent }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`antialiased bg-background text-foreground`}>
				<a
					href="#content"
					className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-primary focus:text-primary-foreground px-3 py-2 rounded-md">
					Skip to content
				</a>
				<AppThemeProvider>
					<main id="content" className="min-h-dvh focus:outline-none">
						{appContent}
					</main>
				</AppThemeProvider>
			</body>
		</html>
	);
}
