import React from 'react';
import SignUp from '@/components/signUp';
import OrderTaxi from '@/app/Order/OrderTaxi';

export default function CreateAccount() {
  return (
    <>
      <SignUp />
      <OrderTaxi/>
    </>
  );
}