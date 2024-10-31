/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.project.service;

import com.project.enums.AvailableStatus;
import com.project.exception.OurException;
import com.project.model.Users;
import com.project.repository.UsersRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 *
 * @author trinh
 */
@Service
public class CustomUserDetailsService implements UserDetailsService{
    
    @Autowired
    private UsersRepository usersRepository;
    
   
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserDetails user = usersRepository.findByUsernameAndAvailableStatus(username, AvailableStatus.ACTIVE).orElse(null);
        
        if(user == null){
            Users ourUser = usersRepository.findByUsernameAndAvailableStatus(username, AvailableStatus.ACTIVE).orElse(null);
            if(ourUser != null){
                return ourUser;
            }
        }
        
        if(user == null){
            throw new OurException("Username not found with username: " + username);
        }
        
        return user;
    }
    
    
}
