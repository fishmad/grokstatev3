<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

class Handler extends ExceptionHandler
{
    // ...existing code...
    public function render($request, Throwable $e)
    {
        if ($request->expectsJson()) {
            if ($e instanceof ValidationException) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $e->errors(),
                ], 422);
            }
            if ($e instanceof HttpExceptionInterface) {
                return response()->json([
                    'message' => $e->getMessage() ?: 'HTTP error',
                ], $e->getStatusCode());
            }
            return response()->json([
                'message' => $e->getMessage() ?: 'Server error',
            ], 500);
        }
        return parent::render($request, $e);
    }
}
