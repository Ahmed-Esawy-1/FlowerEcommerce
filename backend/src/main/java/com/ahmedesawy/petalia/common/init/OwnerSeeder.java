package com.ahmedesawy.petalia.common.init;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Optional;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.ahmedesawy.petalia.role.Permission;
import com.ahmedesawy.petalia.role.Role;
import com.ahmedesawy.petalia.role.RoleRepository;
import com.ahmedesawy.petalia.user.employee.Employee;
import com.ahmedesawy.petalia.user.employee.EmployeeRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OwnerSeeder implements CommandLineRunner {

    private final EmployeeRepository employeeRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String OWNER_EMAIL = "ahmed76esawy@gmail.com";

    @Override
    public void run(String... args) throws Exception {

        Optional<Role> existingRole = roleRepository.findByCode("OWNER");

        Role ownerRole = existingRole
                .map(role -> {
                    role.setPermissions(new HashSet<>(Arrays.asList(Permission.values())));
                    return roleRepository.save(role);
                })
                .orElseGet(() -> roleRepository.save(Role.owner()));

        employeeRepository.findByEmail(OWNER_EMAIL).ifPresentOrElse(employee -> {
            if (!employee.getRole().getId().equals(ownerRole.getId())) {
                employee.setRole(ownerRole);
                employeeRepository.save(employee);
            }
        }, () -> {
            Employee owner = new Employee();
            owner.setUserName("Ahmed Esawy");
            owner.setEmail(OWNER_EMAIL);
            owner.setPassword(passwordEncoder.encode("1234"));
            owner.setRole(ownerRole);
            owner.setEmailVerified(true);
            employeeRepository.save(owner);
        });
    }

}
