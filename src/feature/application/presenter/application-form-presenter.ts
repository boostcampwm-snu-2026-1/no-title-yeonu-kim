import type { Input, InputForForm } from '@/entities/input';
import type { ApplicationInputPresenter } from './application-input-presenter';

type ApplicationFormPresenter = {
  useValidator({
    applicationInputPresenter,
  }: {
    applicationInputPresenter: ApplicationInputPresenter;
  }): {
    inputStates: {
      walletAddress: Input<string>;
      imageFile: Input<File | null>;
    };
    formStates: {
      walletAddress: InputForForm<string>;
      imageFile: InputForForm<File | null>;
    };
  };
};

export const applicationFormPresenter: ApplicationFormPresenter = {
  useValidator: ({ applicationInputPresenter }) => {
    const { walletAddress, imageFile } =
      applicationInputPresenter.useValidator();
    return {
      inputStates: { walletAddress, imageFile },
      formStates: { walletAddress, imageFile },
    };
  },
};
