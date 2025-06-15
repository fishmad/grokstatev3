<?php

namespace App\Http\Controllers;

use OpenApi\Annotations as OA;

 /**
 * @OA\Tag(
 *     name="user",
 *     description="User related operations"
 * )
 * @OA\Info(
 *     version="1.0",
 *     title="X-Realty Estate API",
 *     description="API endpoints for real estate management",
 *     @OA\Contact(name="X-Realty Estate API Team")
 * )
 * @OA\Server(
 *     url="http://127.0.0.1:8000",
 *     description="API server"
 * )
 */

class OpenApi extends Controller
{
    //
}