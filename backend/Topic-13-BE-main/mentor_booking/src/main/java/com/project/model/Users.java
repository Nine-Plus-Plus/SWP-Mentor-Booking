package com.project.model;

import com.project.enums.AvailableStatus;
import com.project.enums.Gender;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

/**
 *
 * @author Thịnh Đạt
 */
@Data
@Entity
@Table(name = "users")
public class Users implements UserDetails{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @Column(name = "username")
    @NotBlank(message = "username cannot be blank")
    private String username;
    
    @Column(name = "password")
    @NotBlank(message = "password cannot be blank")
    private String password;
    
    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;

    @Column(name = "fullName")
    private String fullName;
    
    @Column(name = "birth_date")
    private LocalDate birthDate;
    
    @Column(name = "avatar")
    private String avatar;
    
    @Column(name = "email")
    @NotBlank(message = "email cannot be blank")
    private String email;
    
    @Column(name = "address")
    private String address;
    
    @Column(name = "phone")
    private String phone;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;
    
    @Column(name = "date_updated")
    private LocalDateTime dateUpdated;
    
    @Column(name = "date_created")
    private LocalDateTime dateCreated;

    @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Notifications> notifications;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Reviews> reviews;
    
    @OneToOne(mappedBy = "user")
    private Students student;
    
    @OneToOne(mappedBy = "user")
    private Mentors mentor;

    @Enumerated(EnumType.STRING)
    @Column(name = "available_status")
    private AvailableStatus availableStatus;

    private String otpCode;
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.getRoleName()));
    }
    
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }
    
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
        
    }
    
    @Override
    public boolean isEnabled() {
        return true;
    }
}
