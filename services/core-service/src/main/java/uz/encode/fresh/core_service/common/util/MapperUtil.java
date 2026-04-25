package uz.encode.fresh.core_service.common.util;

import org.springframework.beans.BeanUtils;

public class MapperUtil {

    public static <T> T map(Object source, Class<T> targetClass) {
        try {
            T target = targetClass.getDeclaredConstructor().newInstance();
            BeanUtils.copyProperties(source, target);
            return target;
        } catch (Exception e) {
            throw new RuntimeException("Mapping failed");
        }
    }
}
