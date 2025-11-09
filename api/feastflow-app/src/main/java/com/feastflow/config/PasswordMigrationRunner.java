package com.feastflow.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.feastflow.model.Customer;
import com.feastflow.model.RestaurantStaff;
import com.feastflow.repository.ICustomerRepository;
import com.feastflow.repository.IRestaurantStaffRepository;

@Component
public class PasswordMigrationRunner implements CommandLineRunner {
    private static final Logger log = LoggerFactory.getLogger(PasswordMigrationRunner.class);

    private final boolean migrate;
    private final PasswordEncoder encoder;
    private final ICustomerRepository customerRepo;
    private final IRestaurantStaffRepository staffRepo;

    public PasswordMigrationRunner(
            @Value("${security.password.migrate:false}") boolean migrate,
            PasswordEncoder encoder,
            ICustomerRepository customerRepo,
            IRestaurantStaffRepository staffRepo) {
        this.migrate = migrate;
        this.encoder = encoder;
        this.customerRepo = customerRepo;
        this.staffRepo = staffRepo;
    }

    @Override
    public void run(String... args) {
        if (!migrate) {
            return;
        }
        log.info("Starting plaintext password migration to BCrypt...");
        int staffCount = 0;
        for (RestaurantStaff s : staffRepo.findAll()) {
            String pw = s.getStaffPassword();
            if (needsHash(pw)) {
                s.setStaffPassword(encoder.encode(pw));
                staffRepo.save(s);
                staffCount++;
            }
        }
        int custCount = 0;
        for (Customer c : customerRepo.findAll()) {
            String pw = c.getCustomerPassword();
            if (needsHash(pw)) {
                c.setCustomerPassword(encoder.encode(pw));
                customerRepo.save(c);
                custCount++;
            }
        }
        log.info("Password migration complete. Staff updated: {} Customers updated: {}", staffCount, custCount);
    }

    private boolean needsHash(String pw) {
        if (pw == null || pw.isBlank()) return false; // skip empty
        // Detect BCrypt format ($2a$, $2b$, $2y$)
        return !(pw.startsWith("$2a$") || pw.startsWith("$2b$") || pw.startsWith("$2y$"));
    }
}
