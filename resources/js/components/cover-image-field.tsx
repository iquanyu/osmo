import { ImagePlus, Link2, Upload, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type CoverMode = 'upload' | 'url';

interface Props {
    url: string;
    file: File | null;
    onUrlChange: (url: string) => void;
    onFileChange: (file: File | null) => void;
    urlError?: string;
    fileError?: string;
    previewAlt?: string;
}

export function CoverImageField({
    url,
    file,
    onUrlChange,
    onFileChange,
    urlError,
    fileError,
    previewAlt = '封面预览',
}: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [mode, setMode] = useState<CoverMode>(file ? 'upload' : 'url');
    const objectUrl = useMemo(
        () => (file ? URL.createObjectURL(file) : null),
        [file],
    );

    useEffect(() => {
        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [objectUrl]);

    const previewSrc = objectUrl ?? url;
    const errorMessage = fileError || urlError;

    const handleModeChange = (nextMode: CoverMode) => {
        setMode(nextMode);

        if (nextMode === 'url') {
            onFileChange(null);
        } else {
            onUrlChange('');
        }
    };

    const handleFileSelect = (selected: File | null) => {
        onFileChange(selected);

        if (selected) {
            onUrlChange('');
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
                <Label>封面图片</Label>
                <div className="flex gap-1 rounded-lg border border-border p-0.5">
                    <Button
                        type="button"
                        variant={mode === 'upload' ? 'default' : 'ghost'}
                        size="sm"
                        className="h-7 px-2.5 text-xs"
                        onClick={() => handleModeChange('upload')}
                    >
                        <Upload className="mr-1 h-3.5 w-3.5" />
                        本地上传
                    </Button>
                    <Button
                        type="button"
                        variant={mode === 'url' ? 'default' : 'ghost'}
                        size="sm"
                        className="h-7 px-2.5 text-xs"
                        onClick={() => handleModeChange('url')}
                    >
                        <Link2 className="mr-1 h-3.5 w-3.5" />
                        外链 URL
                    </Button>
                </div>
            </div>

            {mode === 'upload' ? (
                <div className="space-y-2">
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) =>
                            handleFileSelect(e.target.files?.[0] ?? null)
                        }
                    />
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => inputRef.current?.click()}
                        >
                            <ImagePlus className="mr-1 h-4 w-4" />
                            {file ? '重新选择' : '选择图片'}
                        </Button>
                        {file ? (
                            <>
                                <span className="truncate text-xs text-muted-foreground">
                                    {file.name}
                                </span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => {
                                        handleFileSelect(null);

                                        if (inputRef.current) {
                                            inputRef.current.value = '';
                                        }
                                    }}
                                >
                                    <X className="h-3.5 w-3.5" />
                                </Button>
                            </>
                        ) : (
                            <span className="text-xs text-muted-foreground">
                                支持 JPG / PNG / WebP，最大 5MB
                            </span>
                        )}
                    </div>
                </div>
            ) : (
                <div className="grid gap-2">
                    <Input
                        value={url}
                        onChange={(e) => onUrlChange(e.target.value)}
                        placeholder="https://"
                    />
                </div>
            )}

            <InputError message={errorMessage} />

            {previewSrc ? (
                <div className="overflow-hidden rounded-xl border">
                    <img
                        src={previewSrc}
                        alt={previewAlt}
                        className="h-40 w-full object-cover"
                    />
                </div>
            ) : null}
        </div>
    );
}
