class Calculator:
    calculation_type = "Arithmetic Operations"

    @staticmethod
    def add(a, b):
        """Return the sum of two numbers (no access to class or instance)."""
        return a + b

    @classmethod
    def multiply(cls, a, b):
        """Return the product of two numbers and print the class attribute."""
        print(f"Calculation type: {cls.calculation_type}")
        return a * b
