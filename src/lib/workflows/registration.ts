import { Effect } from "effect";
import { hashPassword } from "@/lib/auth/utils";
import { db } from "@/lib/db";
import { posts, users } from "@/lib/db/schema";

type HashError = {
  _tag: "HashError";
  cause: unknown;
};

type CreateUserError = {
  _tag: "CreateUserError";
  cause: unknown;
};

type CreatePostError = {
  _tag: "CreatePostError";
  cause: unknown;
};

type NotifyError = {
  _tag: "NotifyError";
  cause: unknown;
};

interface RegistrationResult {
  success: true;
  user: typeof users.$inferSelect;
  welcomePost: typeof posts.$inferSelect;
  notification: NotificationResult;
}

interface NotificationResult {
  sent: boolean;
  messageId: string;
}

const hashPasswordEffect = (password: string) =>
  Effect.tryPromise({
    try: () => hashPassword(password),
    catch: (cause): HashError => ({ _tag: "HashError", cause }),
  });

const createUserEffect = (username: string, hashedPassword: string) =>
  Effect.tryPromise({
    try: () =>
      db
        .insert(users)
        .values({
          username,
          hashedPassword,
          createdAt: new Date(),
        })
        .returning()
        .then(([user]) => user),
    catch: (cause): CreateUserError => ({ _tag: "CreateUserError", cause }),
  });

const createWelcomePostEffect = (username: string, userId: number) =>
  Effect.tryPromise({
    try: () =>
      db
        .insert(posts)
        .values({
          title: `Welcome ${username}!`,
          content: `Welcome to our platform, ${username}! We're excited to have you here.`,
          authorId: userId,
          likeCount: 0,
          createdAt: new Date(),
        })
        .returning()
        .then(([post]) => post),
    catch: (cause): CreatePostError => ({ _tag: "CreatePostError", cause }),
  });

const sendWelcomeNotificationEffect = (username: string, userId: number) =>
  Effect.tryPromise({
    try: () => sendWelcomeNotification(username, userId),
    catch: (cause): NotifyError => ({ _tag: "NotifyError", cause }),
  });

export const registerUserEffect = (username: string, password: string) =>
  Effect.gen(function* (_) {
    const hashedPassword = yield* _(hashPasswordEffect(password));

    const user = yield* _(createUserEffect(username, hashedPassword));

    const welcomePost = yield* _(createWelcomePostEffect(username, user.id));

    const notification = yield* _(sendWelcomeNotificationEffect(username, user.id));

    return {
      success: true,
      user,
      welcomePost,
      notification,
    } satisfies RegistrationResult;
  });

async function sendWelcomeNotification(username: string, userId: number): Promise<NotificationResult> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.1) {
        resolve({
          sent: true,
          messageId: `msg_${userId}_${Date.now()}`,
        });
      } else {
        reject(new Error("Notification service unavailable"));
      }
    }, 500);
  });
}

export function registerUser(username: string, password: string) {
  const effect = registerUserEffect(username, password).pipe(
    Effect.catchAll((error) => {
      if (error._tag === "HashError") {
        console.error("Failed to hash password:", error.cause);
        return Effect.fail(new Error("Failed to process password"));
      }

      if (error._tag === "CreateUserError") {
        console.error("Failed to create user:", error.cause);
        return Effect.fail(new Error("Failed to create user account"));
      }

      if (error._tag === "CreatePostError") {
        console.error("Failed to create welcome post:", error.cause);
        return Effect.fail(new Error("Failed to create welcome post"));
      }

      if (error._tag === "NotifyError") {
        console.error("Failed to send welcome notification:", error.cause);
        return Effect.fail(new Error("Failed to send welcome notification"));
      }

      console.error("Unexpected registration error:", error);
      return Effect.fail(new Error("Registration failed"));
    })
  );

  return Effect.runPromise(effect);
}
