import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMutation } from 'react-query';
import { login, setUser } from '@/lib/auth';
import { useNavigate } from 'react-router';

type LoginForm = {
  email: string;
  password: string;
};

export function Login() {
  const form = useForm<LoginForm>();
  const navigate = useNavigate();

  const { mutate: doLogin } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // TODO: parse the data to the correct type
      setUser(data as { token: string });
      navigate('/');
    },
  });

  return (
    <div className="flex flex-col size-full items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => doLogin(data))}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit">Login</Button>
        </form>
      </Form>
    </div>
  );
}
