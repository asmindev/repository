<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Karya Tulis Ilmiah Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains settings for the KTI Repository system.
    |
    */

    'files' => [
        // Full Document & Chapters
        'max_size' => env('KTI_MAX_FILE_SIZE', 51200), // KB (50MB)
        'allowed_mimes' => ['pdf', 'doc', 'docx'],
        'allowed_mime_types' => ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],

        // Cover Images
        'cover_max_size' => env('KTI_MAX_COVER_SIZE', 2048), // KB (2MB)
        'cover_allowed_mimes' => ['jpg', 'jpeg', 'png'],
        'cover_allowed_mime_types' => ['image/jpeg', 'image/png', 'image/jpg'],

        // Avatar
        'avatar_max_size' => env('KTI_MAX_AVATAR_SIZE', 2048), // KB (2MB)
        'avatar_allowed_mimes' => ['jpg', 'jpeg', 'png'],
    ],
];
