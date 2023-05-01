'use client';
import { signIn } from 'next-auth/react';
import axios from 'axios';
import { useState, useCallback } from 'react';
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import {
  FieldValue,
  FieldValues,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import Heading from '../Heading';
import useRegisterModal from '@/app/hooks/useRegisterModal';
import Modal from './Modal';
import Input from '../inputs/Input';
import { toast } from 'react-hot-toast';
import Button from '../Button';
import useLoginModal from '@/app/hooks/useLoginModal';
import { useRouter } from 'next/navigation';

const LoginModal = () => {
  const router = useRouter();
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setLoading(true);
    signIn('credentials', {
      ...data,
      redirect: false,
    }).then((res) => {
      setLoading(false);
      if (res?.ok) {
        toast.success('Logged in successfully!');
        router.refresh();
        loginModal.close();
      }
      if (res?.error) {
        toast.error(res.error);
      }
    });
  };

  const toggle = useCallback(() => {
    loginModal.close();
    registerModal.open();
  }, [loginModal, registerModal]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Welcome back" subtitle="Login to your account!" />
      <Input
        id="email"
        label="Email"
        disabled={loading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        type="password"
        label="Password"
        disabled={loading}
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  const footerContent = (
    <div className=" flex flex-col gap-4 mt-3">
      <hr />
      <Button
        outline
        label="Continue with Google"
        icon={FcGoogle}
        onClick={() => signIn('google')}
      />
      <Button
        outline
        label="Continue with Github"
        icon={AiFillGithub}
        onClick={() => signIn('github')}
      />
      <div className=" text-neutral-500 text-center mt-4 font-light">
        <div className=" justify-center flex flex-row items-center gap-2">
          <div>First time using Airbnb?</div>
          <div
            onClick={toggle}
            className=" text-neutral-800 cursor-pointer hover:underline"
          >
            Create an account
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={loading}
      body={bodyContent}
      footer={footerContent}
      isOpen={loginModal.isOpen}
      title="Login"
      actionLabel="Continue"
      onClose={loginModal.close}
      onSubmit={handleSubmit(onSubmit)}
    />
  );
};

export default LoginModal;
