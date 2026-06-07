import { CheckCircle, ImagePlus, Upload, Wallet, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { useParams } from 'react-router';
import { applicationFormPresenter } from '@/feature/application/presenter/application-form-presenter';
import { applicationInputPresenter } from '@/feature/application/presenter/application-input-presenter';
import { QueryContext } from '@/feature/shared/context/query-context';
import { useGuardContext } from '@/feature/shared/context/use-gaurd-context';
import { Button } from '@/widgets/common/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/widgets/common/ui/card';
import { Input } from '@/widgets/common/ui/input';
import { Label } from '@/widgets/common/ui/label';

declare global {
  interface Window {
    ethereum?: {
      request(args: { method: string }): Promise<string[]>;
    };
  }
}

const ALLOWED_EXTENSIONS = '.jpg,.jpeg,.png,.webp';

export const SubmitForm = () => {
  const { storeId, eventId } = useParams<{
    storeId: string;
    eventId: string;
  }>();

  const { applicationQuery } = useGuardContext(QueryContext);

  const { store } = applicationQuery.useGetStore({ storeId: storeId ?? '' });
  const { event } = applicationQuery.useGetEvent({ eventId: eventId ?? '' });

  const { inputStates, formStates } = applicationFormPresenter.useValidator({
    applicationInputPresenter,
  });

  const [metaMaskConnected, setMetaMaskConnected] = useState(false);
  const [metaMaskError, setMetaMaskError] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { submitApplication, isPending } =
    applicationQuery.useSubmitApplication({
      setResponseMessage,
      onSuccess: () => {
        setIsSubmitted(true);
      },
    });

  const handleMetaMaskConnect = async () => {
    setMetaMaskError('');
    if (window.ethereum === undefined) {
      setMetaMaskError(
        'MetaMask가 설치되어 있지 않습니다. metamask.io에서 설치해 주세요.'
      );
      return;
    }
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      const address = accounts[0];
      if (address !== undefined) {
        inputStates.walletAddress.onChange(address);
        setMetaMaskConnected(true);
      }
    } catch {
      setMetaMaskError('MetaMask 연결에 실패했습니다.');
    }
  };

  const handleDisconnectMetaMask = () => {
    inputStates.walletAddress.onChange('');
    setMetaMaskConnected(false);
    setMetaMaskError('');
  };

  const handleManualAddressChange = (value: string) => {
    if (metaMaskConnected) {
      setMetaMaskConnected(false);
    }
    inputStates.walletAddress.onChange(value);
    setMetaMaskError('');
  };

  const handleFileSelect = (file: File) => {
    inputStates.imageFile.onChange(file);
    if (previewUrl !== null) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleFileClear = () => {
    inputStates.imageFile.onChange(null);
    if (previewUrl !== null) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current !== null) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file !== undefined) {
      handleFileSelect(file);
    }
  };

  const handleSubmit = () => {
    if (storeId === undefined || eventId === undefined) {
      return;
    }
    if (formStates.walletAddress.isError || formStates.imageFile.isError) {
      return;
    }
    if (inputStates.imageFile.value === null) {
      setResponseMessage('인증 사진을 업로드해 주세요.');
      return;
    }

    submitApplication({
      eventId,
      walletAddress: inputStates.walletAddress.value,
      imageFile: inputStates.imageFile.value,
    });
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center gap-6 py-12 text-center">
        <CheckCircle className="size-16 text-primary" />
        <div className="space-y-2">
          <h2 className="font-semibold text-xl">제출 완료</h2>
          <p className="text-muted-foreground text-sm">
            신청이 접수되었습니다. 사장님이 인증을 검토한 후 리워드가
            지급됩니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-semibold text-xl">이벤트 참여 신청</h1>

      {/* 가게·이벤트 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">가게 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          {store !== undefined ? (
            <>
              <p className="font-medium">{store.name}</p>
              <p className="text-muted-foreground">{store.address}</p>
            </>
          ) : (
            <p className="text-muted-foreground">불러오는 중...</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">이벤트 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {event !== undefined ? (
            <>
              <p className="font-medium">{event.title}</p>
              <p className="text-muted-foreground">{event.condition}</p>
              <p className="font-semibold text-primary">{event.reward} ETH</p>
            </>
          ) : (
            <p className="text-muted-foreground">불러오는 중...</p>
          )}
        </CardContent>
      </Card>

      {/* 지갑 등록 */}
      <div className="space-y-3">
        <Label className="font-medium text-sm">지갑 주소</Label>

        {/* MetaMask 연결 */}
        {metaMaskConnected ? (
          <div className="flex items-center gap-2 rounded-md border bg-muted px-3 py-2 text-sm">
            <Wallet className="size-4 shrink-0 text-primary" />
            <span className="flex-1 truncate font-mono text-xs">
              {inputStates.walletAddress.value}
            </span>
            <button
              type="button"
              onClick={handleDisconnectMetaMask}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              void handleMetaMaskConnect();
            }}
          >
            <Wallet className="mr-2 size-4" />
            MetaMask 연결
          </Button>
        )}

        {metaMaskError.length > 0 && (
          <p className="text-destructive text-xs">{metaMaskError}</p>
        )}

        {/* 구분선 */}
        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-border" />
          <span className="text-muted-foreground text-xs">또는</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* 직접 입력 */}
        <div className="space-y-1">
          <Input
            placeholder="지갑 주소 직접 입력 (0x...)"
            value={metaMaskConnected ? '' : inputStates.walletAddress.value}
            onChange={(e) => {
              handleManualAddressChange(e.target.value);
            }}
          />
          {!metaMaskConnected &&
            inputStates.walletAddress.value.length > 0 &&
            formStates.walletAddress.isError && (
              <p className="text-destructive text-xs">
                올바른 이더리움 주소를 입력해 주세요 (0x 시작, 42자)
              </p>
            )}
        </div>
      </div>

      {/* 인증 사진 업로드 */}
      <div className="space-y-3">
        <Label className="font-medium text-sm">인증 사진</Label>

        {previewUrl !== null ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt="인증 사진 미리보기"
              className="h-48 w-full rounded-lg object-cover"
            />
            <button
              type="button"
              onClick={handleFileClear}
              className="absolute top-2 right-2 rounded-full bg-background/80 p-1 hover:bg-background"
            >
              <X className="size-4" />
            </button>
            {formStates.imageFile.isError && (
              <p className="mt-1 text-destructive text-xs">
                jpg, jpeg, png, webp 파일만 가능하며 크기는 10MB 이하여야
                합니다.
              </p>
            )}
          </div>
        ) : (
          <div
            className={`flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 border-dashed p-8 transition-colors ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/30 hover:border-primary/50'
            }`}
            onClick={() => {
              fileInputRef.current?.click();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                fileInputRef.current?.click();
              }
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => {
              setIsDragging(false);
            }}
            onDrop={handleDrop}
            role="button"
            tabIndex={0}
          >
            {isDragging ? (
              <Upload className="size-8 text-primary" />
            ) : (
              <ImagePlus className="size-8 text-muted-foreground" />
            )}
            <div className="text-center">
              <p className="text-sm">클릭하거나 파일을 끌어다 놓으세요</p>
              <p className="text-muted-foreground text-xs">
                JPG, PNG, WEBP · 최대 10MB
              </p>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_EXTENSIONS}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file !== undefined) {
              handleFileSelect(file);
            }
          }}
        />
      </div>

      {/* 에러 메시지 */}
      {responseMessage.length > 0 && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-center text-destructive text-sm">
          {responseMessage}
        </p>
      )}

      <Button
        className="w-full"
        disabled={
          isPending ||
          formStates.walletAddress.isError ||
          formStates.imageFile.isError
        }
        onClick={handleSubmit}
      >
        {isPending ? '제출 중...' : '제출하기'}
      </Button>
    </div>
  );
};
