package com.envidual.tweets_app;

import org.springframework.boot.SpringApplication;

public class TestTweetsAppApplication {

	public static void main(String[] args) {
		SpringApplication.from(TweetsAppApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
