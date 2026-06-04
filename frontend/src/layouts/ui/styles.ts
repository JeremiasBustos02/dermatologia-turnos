// src/components/ui/styles.ts
export const UI = {
  button: {
    primary: "flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-150 shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
    secondary: "flex items-center gap-2 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 px-4 py-2 rounded-lg font-medium transition-all duration-150 shadow-sm active:scale-[0.98]",
    icon: "p-2 rounded-lg transition-colors border shadow-sm active:scale-95",
  },
  table: {
    wrapper: "bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm",
    th: "px-6 py-4 font-semibold text-slate-700 text-xs uppercase tracking-wider bg-slate-50 border-b border-slate-200",
    tr: "hover:bg-slate-50/70 transition-colors",
    td: "px-6 py-4 whitespace-nowrap text-slate-600",
  },
  typography: {
    title: "text-xl font-bold text-slate-900 tracking-tight",
    subtitle: "text-slate-500 text-sm leading-relaxed",
  }
};