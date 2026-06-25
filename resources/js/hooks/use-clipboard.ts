// Credit: https://usehooks-ts.com/
import { useState } from 'react';
import { copyToClipboard } from '@/lib/copy-to-clipboard';

export type CopiedValue = string | null;
export type CopyFn = (text: string) => Promise<boolean>;
export type UseClipboardReturn = [CopiedValue, CopyFn];

export function useClipboard(): UseClipboardReturn {
    const [copiedText, setCopiedText] = useState<CopiedValue>(null);

    const copy: CopyFn = async (text) => {
        const success = await copyToClipboard(text);

        if (success) {
            setCopiedText(text);
        } else {
            setCopiedText(null);
        }

        return success;
    };

    return [copiedText, copy];
}
