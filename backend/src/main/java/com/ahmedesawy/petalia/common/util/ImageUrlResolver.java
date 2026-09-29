package com.ahmedesawy.petalia.common.util;

import lombok.experimental.UtilityClass;

@UtilityClass
public class ImageUrlResolver {

    private static final String UPLOAD_BASE_PATH = "/api/upload_images/";

    public static String resolve(String folder, String imageUrl) {
        return imageUrl != null 
                ? UPLOAD_BASE_PATH + folder + "/" + imageUrl 
                : null;
    }
}