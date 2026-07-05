<?php

declare(strict_types=1);

namespace Mpc\MpCore\Exception;

class FileException extends \Exception
{
    /**
     * @param array<string, mixed> $context
     */
    public function __construct(
        string $message,
        int $code = 0,
        private readonly array $context = [],
        ?\Throwable $previous = null,
    ) {
        parent::__construct($message, $code, $previous);
    }

    /**
     * @return array<string, mixed>
     */
    public function getContext(): array
    {
        return $this->context;
    }
}
