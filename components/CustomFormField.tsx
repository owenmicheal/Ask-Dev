/* eslint-disable no-unused-vars */
import { E164Number } from "libphonenumber-js/core";
import Image from "next/image";
import ReactDatePicker from "react-datepicker";
import { Control } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import { Checkbox } from "./ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

interface CustomProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
  fieldType: FormFieldType;
}

const RenderInput = ({ field, props }: { field: any; props: CustomProps }) => {
  switch (props.fieldType) {
    case FormFieldType.INPUT:
      return (
        <FormControl>
          <div className="relative w-full">
            <Input
              placeholder={props.placeholder}
              {...field}
              className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus min-h-12 rounded-1.5 border pl-10 w-full"
            />
            {props.iconSrc && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Image
                  src={props.iconSrc}
                  height={24}
                  width={24}
                  alt={props.iconAlt || "icon"}
                />
              </div>
            )}
          </div>
        </FormControl>
      );
    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={props.placeholder}
            {...field}
            className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus min-h-12 rounded-1.5 border"
            disabled={props.disabled}
          />
        </FormControl>
      );
    case FormFieldType.PHONE_INPUT:
      return (
        <FormControl>
          <div className="relative w-full">
            <PhoneInput
              defaultCountry="UG"
              placeholder={props.placeholder}
              international
              withCountryCallingCode
              value={field.value as E164Number | undefined}
              onChange={field.onChange}
              className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus min-h-12 rounded-1.5 border w-full px-3"
            />
          </div>
        </FormControl>
      );
    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center gap-4">
            <Checkbox
              id={props.name}
              checked={field.value}
              onCheckedChange={field.onChange}
              className="background-light900_dark300 light-border-2"
            />
            <label
              htmlFor={props.name}
              className="paragraph-medium text-dark400_light700"
            >
              {props.label}
            </label>
          </div>
        </FormControl>
      );
    case FormFieldType.DATE_PICKER:
      return (
        <FormControl>
          <div className="relative w-full">
            <ReactDatePicker
              showTimeSelect={props.showTimeSelect ?? false}
              selected={field.value}
              onChange={(date: Date | null) => {
                if (date) {
                  field.onChange(date);
                }
              }}
              timeInputLabel="Time:"
              dateFormat={props.dateFormat ?? "MM/dd/yyyy"}
              wrapperClassName="date-picker w-full"
              className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus min-h-12 rounded-1.5 border pl-10 w-full"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Image
                src="icons/calendar.svg"
                height={24}
                width={24}
                alt="calendar"
              />
            </div>
          </div>
        </FormControl>
      );
    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus min-h-12 rounded-1.5 border">
              <SelectValue placeholder={props.placeholder} />
            </SelectTrigger>
            <SelectContent className="background-light900_dark300 light-border-2 text-dark300_light700">
              {props.children}
            </SelectContent>
          </Select>
        </FormControl>
      );
    case FormFieldType.SKELETON:
      return props.renderSkeleton ? props.renderSkeleton(field) : null;
    default:
      return null;
  }
};

const CustomFormField = (props: CustomProps) => {
  const { control, name, label } = props;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex w-full flex-col gap-2.5">
          {props.fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel className="paragraph-medium text-dark400_light700">
              {label}
            </FormLabel>
          )}
          <RenderInput field={field} props={props} />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
