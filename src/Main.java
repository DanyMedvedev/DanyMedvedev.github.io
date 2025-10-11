//TIP To <b>Run</b> code, press <shortcut actionId="Run"/> or
// click the <icon src="AllIcons.Actions.Execute"/> icon in the gutter.
import java.util.Scanner;
import java.util.Random;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Random random = new Random();
        int secretNumber = random.nextInt(100) + 1; // число от 1 до 100
        System.out.println("Я загадал число от 1 до 100. Попробуй угадать!");
        int guess = 0;
        int attempts = 0;
        while (guess != secretNumber) {
            System.out.print("Введи свой вариант: ");
            guess = scanner.nextInt();
            attempts++;
            if (guess < secretNumber) {
                System.out.println("Мое число больше!");
            } else if (guess > secretNumber) {
                System.out.println("Мое число меньше!");
            } else {
                System.out.println("Поздравляю! Ты угадал число за " + attempts + " попыток.");
            }
        }
        scanner.close();
    }
}