import { WizardForm } from '.';
import { TypographyH3 } from '../ui/typography/h3';

interface Props {
  form: WizardForm;
}
export function Summary({ form }: Props) {
  const values = form.getValues();

  return (
    <div className="flex h-full flex-col py-6">
      <TypographyH3 className="mb-6">Summary</TypographyH3>
      <div className="flex flex-1 gap-6">
        <div className="flex">
          <pre>{JSON.stringify(values, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
