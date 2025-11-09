package com.feastflow.security;

import java.util.List;
import java.util.Optional;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.feastflow.model.Customer;
import com.feastflow.model.RestaurantStaff;
import com.feastflow.repository.ICustomerRepository;
import com.feastflow.repository.IRestaurantStaffRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final ICustomerRepository customerRepository;
    private final IRestaurantStaffRepository staffRepository;

    public CustomUserDetailsService(ICustomerRepository customerRepository, IRestaurantStaffRepository staffRepository) {
        this.customerRepository = customerRepository;
        this.staffRepository = staffRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<RestaurantStaff> staffOpt = staffRepository.findByStaffEmail(username);
        if (staffOpt.isPresent()) {
            RestaurantStaff staff = staffOpt.get();
            String roleName = staff.getRole() != null ? staff.getRole().name() : "USER";
            List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + roleName));
            return new User(staff.getStaffEmail(), staff.getStaffPassword(), authorities);
        }
        Optional<Customer> customerOpt = customerRepository.findByCustomerEmail(username);
        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();
            List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_CUSTOMER"));
            return new User(customer.getCustomerEmail(), customer.getCustomerPassword(), authorities);
        }
        throw new UsernameNotFoundException("User not found with email: " + username);
    }
}
