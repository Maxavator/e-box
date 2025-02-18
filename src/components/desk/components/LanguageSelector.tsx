
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";

const languages = [
  { code: 'en', name: 'English' },
  { code: 'af', name: 'Afrikaans' },
  { code: 'zu', name: 'isiZulu' },
  { code: 'tn', name: 'Setswana' },
  { code: 'xh', name: 'isiXhosa' },
  { code: 'ts', name: 'Xitsonga' },
  { code: 'nr', name: 'Ndebele' },
  { code: 'st', name: 'Sesotho' },
  { code: 'nso', name: 'Sepedi' },
  { code: 've', name: 'Venda' }
];

export const LanguageSelector = () => {
  const { i18n } = useTranslation();

  return (
    <Select value={i18n.language} onValueChange={(value) => i18n.changeLanguage(value)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
