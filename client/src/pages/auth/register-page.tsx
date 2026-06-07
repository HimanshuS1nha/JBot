import { BotIcon } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import Loading from "@/components/loading";

import { axios } from "@/lib/axios";

import {
  registerValidator,
  type registerValidatorType,
} from "@/validators/register-validator";

import { API_ROUTES } from "@/constants/api-routes";
import { ToastHelper } from "@/helpers/toast-helper";
import { ROUTES } from "@/constants/routes";
import { parseErrorToString } from "@/helpers/parse-error-to-string";

const RegisterPage = () => {
  const navigate = useNavigate();

  const { mutate: handleRegister, isPending } = useMutation({
    mutationKey: ["register"],
    mutationFn: async (values: registerValidatorType) => {
      const { data } = await axios.post<{ message: string }>(
        API_ROUTES.auth.register,
        values,
      );

      return data;
    },
    onSuccess: (data) => {
      ToastHelper.successToast(data.message);
      navigate(ROUTES.auth.login, { replace: true });
    },
    onError: (error) => {
      console.error(error);
      ToastHelper.errorToast(parseErrorToString(error));
    },
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onBlur: registerValidator,
      onSubmit: registerValidator,
    },
    onSubmit: ({ value }) => {
      handleRegister(value);
    },
  });

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 flex-col items-center justify-center bg-primary text-primary-foreground p-10 relative overflow-hidden shrink-0">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-16 -left-16 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        </div>

        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10 flex flex-col items-center text-center gap-8 max-w-xs">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-xl">
              <BotIcon className="w-9 h-9" />
            </div>
            <span className="text-4xl font-bold tracking-tight">JBot</span>
          </div>

          <div className="space-y-3">
            <p className="text-lg font-medium opacity-90 leading-snug">
              Your intelligent companion
            </p>
            <p className="text-sm opacity-60 leading-relaxed">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sit
              impedit obcaecati quod.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 w-full mt-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 text-sm opacity-75"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white/70 shrink-0" />
                Lorem, ipsum dolor.
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center p-6 sm:p-10 overflow-y-auto">
        <div className="flex items-center gap-2.5 mb-8 lg:hidden">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <BotIcon className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold">JBot</span>
        </div>

        <div className="w-full max-w-sm space-y-7">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Welcome
            </h1>
            <p className="text-sm text-muted-foreground">
              Create an account to continue
            </p>
          </div>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="John Doe"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="email"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="example@gmail.com"
                      type="email"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="password"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="********"
                      type="password"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="confirmPassword"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Confirm Password
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="********"
                      type="password"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <Button
              className="w-full h-10 font-medium"
              size="default"
              disabled={isPending}
              type="submit"
            >
              {isPending ? (
                <Loading size={18} className="text-white" />
              ) : (
                "Create"
              )}
            </Button>
          </form>

          <div className="relative flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground shrink-0">
              Already have an account?{" "}
              <Link to={ROUTES.auth.login} className="text-primary underline">
                Login
              </Link>
            </span>
            <Separator className="flex-1" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
