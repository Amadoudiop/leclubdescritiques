<?php
// src/AppBundle/Controller/UserController.php

namespace AppBundle\Controller;

use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;

use FOS\UserBundle\Event\FilterUserResponseEvent;
use FOS\UserBundle\Event\FormEvent;
use FOS\UserBundle\Event\GetResponseUserEvent;
use FOS\UserBundle\Form\Factory\FactoryInterface;
use FOS\UserBundle\FOSUserEvents;
use FOS\UserBundle\Model\UserInterface;
use FOS\UserBundle\Model\UserManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\HttpFoundation\JsonResponse;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class UserController extends Controller
{
    /**
     * @Route("/activateAccount/{token}", name="activate_account")
     */
    public function activateAccount($token)
    {
        /** @var $userManager UserManagerInterface */
        $userManager = $this->get('fos_user.user_manager');

        $user = $userManager->findUserByConfirmationToken($token);

        if (null === $user) {
            throw new NotFoundHttpException(sprintf('The user with "confirmation token" does not exist for value "%s"', $token));
        }else{
            return $this->render('front/confirm_account.html.twig');
        }
    }

    /**
     * @Route("/valideActivateAccount", name="valide_activate_account", options={"expose"=true})
     */
    public function valideActivateAccount(Request $request)
    {
        /** @var $userManager UserManagerInterface */
        $userManager = $this->get('fos_user.user_manager');

        $tokenGenerator = $this->get('fos_user.util.token_generator');

        //on récupère le token dans l'url
        $url = $request->headers->get('referer');
        $token = explode("/activateAccount/", $url);

        //$email = $request->request->get('email');
        
        $user = $userManager->findUserByConfirmationToken($token[1]);

        $firstname = $request->request->get('firstname');
        $lastname = $request->request->get('lastname');
        $password = $request->request->get('password');
        $confirmPassword = $request->request->get('confirmPassword');

        if ($request->getMethod() == 'POST') {
            if (!empty($firstname) && !empty($lastname) && !empty($password) && !empty($confirmPassword)) {
                if (strlen($password) >= 8 && strlen($password) <= 12) {
                    if ($password == $confirmPassword) {
                        $user->setFirstname($firstname);
                        $user->setLastname($lastname);
                        $user->setPlainPassword($password);
                        $user->setEnabled(true);
                        $user->setConfirmationToken(null);              

                        $userManager->updateUser($user);

                        $response = ['valid' => true, 'msg' => 'Votre compte est désormais actif']; 
                    }else{
                        $response = ['valid' => false, 'msg' => 'Votre confirmation de mot de passe est incorrect'];
                    } 
                }else{
                    $response = ['valid' => false, 'msg' => 'Le mot de passe doit être compris entre 8 et 12 caractères'];
                }
                     
            }else{
                $response = ['valid' => false, 'msg' => 'Toutes les informations sont obligatoires'];
            }
        }else{
            $response = ['valid' => false, 'msg' => 'Une erreure est survenue, veuillez réessayer'];
        }

        return new JsonResponse($response);
    }
}