import { useState } from 'react';
import type { Input } from '@/entities/input';

const ETHEREUM_ADDRESS_REGEX = /^0x[0-9a-fA-F]{40}$/;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export type ApplicationInputPresenter = {
  useValidator(): {
    walletAddress: Input<string>;
    imageFile: Input<File | null>;
  };
};

export const applicationInputPresenter: ApplicationInputPresenter = {
  useValidator: () => {
    const [walletAddress, setWalletAddress] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);

    return {
      walletAddress: {
        value: walletAddress,
        isError: !ETHEREUM_ADDRESS_REGEX.test(walletAddress),
        onChange: setWalletAddress,
      },
      imageFile: {
        value: imageFile,
        isError:
          imageFile === null ||
          !ALLOWED_IMAGE_TYPES.includes(imageFile.type) ||
          imageFile.size > MAX_FILE_SIZE,
        onChange: setImageFile,
      },
    };
  },
};
