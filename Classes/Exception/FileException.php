<?php

declare(strict_types=1);

namespace Mpc\MpCore\Exception;

use Exception;

class FileException extends Exception
{
    protected array $context;

    public function __construct(string $message, int $code = 0, array $context = [], ?Exception $previous = null)
    {
        $this->context = $context;
        parent::__construct($message, $code, $previous);
    }

    public function getContext(): array
    {
        return $this->context;
    }
}
