package com.himanshu.jbot.dto;

import com.himanshu.jbot.entity.User;

import lombok.Data;

@Data
public class UserDTO {
    private String id;
    private String name;
    private String email;

    public static UserDTO toDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId().toString());
        userDTO.setName(user.getName());
        userDTO.setEmail(user.getEmail());

        return userDTO;
    }
}
